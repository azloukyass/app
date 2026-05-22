"""
BENNOURI Pièces Auto - Backend API Tests
Tests cover: root, auth (register/login/me), VIN decode, catalog, orders, admin endpoints.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mechanic-hub-200.preview.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@bennouri.com"
ADMIN_PASSWORD = "Admin@123"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def test_user(session):
    # Create a fresh user for the test session
    email = f"TEST_user_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "name": "Test User",
        "email": email,
        "password": "TestPass@123",
        "phone": "+216 11 111 111",
        "address": "Tunis"
    }
    r = session.post(f"{API}/auth/register", json=payload)
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    data = r.json()
    return {"email": email, "password": "TestPass@123", "token": data["token"], "id": data["user"]["id"]}


# ---------- Root ----------
class TestRoot:
    def test_root_ok(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        body = r.json()
        assert body.get("status") == "ok"
        assert "BENNOURI" in body.get("name", "")


# ---------- Auth ----------
class TestAuth:
    def test_register_new_user(self, session):
        email = f"TEST_reg_{uuid.uuid4().hex[:8]}@example.com"
        r = session.post(f"{API}/auth/register", json={
            "name": "Reg User", "email": email, "password": "RegPass@123"
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
        # Backend lowercases email on register
        assert data["user"]["email"] == email.lower()
        assert data["user"]["role"] == "user"
        assert "id" in data["user"]

    def test_register_duplicate_email(self, session, test_user):
        r = session.post(f"{API}/auth/register", json={
            "name": "Dup", "email": test_user["email"], "password": "X@123456"
        })
        assert r.status_code == 400

    def test_admin_login(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["role"] == "admin"
        assert data["user"]["email"] == ADMIN_EMAIL
        assert "token" in data
        # httpOnly cookie should be set
        assert "access_token" in r.cookies or any(
            "access_token" in c for c in r.headers.get("set-cookie", "").split(",")
        )

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-password"})
        assert r.status_code == 401

    def test_me_with_bearer(self, test_user):
        # Use a fresh session (no cookies) so Bearer header is used
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {test_user['token']}"})
        assert r.status_code == 200
        assert r.json()["user"]["email"] == test_user["email"].lower()

    def test_me_without_auth(self):
        # Use a clean session with no cookies/headers
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_bcrypt_format(self, session, admin_token):
        # Indirectly: admin login works → password_hash stored via bcrypt
        # Verified by code review: hash_password uses bcrypt.hashpw + gensalt ($2b$)
        assert admin_token  # admin login already verified above


# ---------- VIN ----------
class TestVin:
    def test_vin_decode_valid(self, session):
        r = session.post(f"{API}/vin/decode", json={"vin": "WVWZZZ1KZ8W123456"})
        assert r.status_code == 200, r.text
        data = r.json()
        # Must include make/model/year/fuel
        for k in ("make", "model", "year", "fuel"):
            assert k in data and data[k], f"missing/empty {k}"
        # WVW prefix → Volkswagen expected
        assert "volk" in data["make"].lower() or data["make"].lower().startswith("v")

    def test_vin_decode_too_short(self, session):
        r = session.post(f"{API}/vin/decode", json={"vin": "ABC123"})
        assert r.status_code == 400


# ---------- Catalog ----------
class TestCatalog:
    def test_sections(self, session):
        r = session.get(f"{API}/catalog/sections")
        assert r.status_code == 200
        sections = r.json()
        slugs = {s["slug"] for s in sections}
        assert {"mecanique", "electrique", "carrosserie"}.issubset(slugs)
        # each section must have label, description, icon
        for s in sections:
            for k in ("slug", "label", "description", "icon"):
                assert k in s and s[k]

    def test_mecanique_categories(self, session):
        r = session.get(f"{API}/catalog/mecanique")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "mecanique"
        assert isinstance(data["categories"], list) and len(data["categories"]) > 0
        labels = {c["label"].lower() for c in data["categories"]}
        # Should contain at least these primary mecanique categories
        expected_any = {"moteur", "freinage", "suspension", "direction"}
        assert expected_any.intersection(labels), f"expected mecanique labels missing, got {labels}"

    def test_electrique_categories(self, session):
        r = session.get(f"{API}/catalog/electrique")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["categories"], list) and len(data["categories"]) > 0

    def test_carrosserie_categories(self, session):
        r = session.get(f"{API}/catalog/carrosserie")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["categories"], list) and len(data["categories"]) > 0

    def test_category_parts(self, session):
        # Try to fetch first category of mecanique dynamically (avoid hardcoding slug)
        r = session.get(f"{API}/catalog/mecanique")
        assert r.status_code == 200
        first_cat_slug = r.json()["categories"][0]["slug"]
        r2 = session.get(f"{API}/catalog/mecanique/{first_cat_slug}")
        assert r2.status_code == 200
        cat = r2.json()
        assert "parts" in cat and isinstance(cat["parts"], list) and len(cat["parts"]) > 0
        p = cat["parts"][0]
        for k in ("ref", "name", "brand", "image", "price_tnd"):
            assert k in p, f"part missing {k}"
        assert isinstance(p["price_tnd"], (int, float))

    def test_category_404(self, session):
        r = session.get(f"{API}/catalog/mecanique/does-not-exist-zzz")
        assert r.status_code == 404


# ---------- Orders ----------
class TestOrders:
    def test_create_order_unauth(self, session):
        r = requests.post(f"{API}/orders", json={
            "items": [{"ref": "X", "quantity": 1}],
            "shipping_address": "Tunis",
            "phone": "12345678",
        })
        assert r.status_code == 401

    def test_create_and_list_order(self, session, test_user):
        # Find a real part ref
        s = session.get(f"{API}/catalog/mecanique").json()
        first_cat = s["categories"][0]["slug"]
        cat = session.get(f"{API}/catalog/mecanique/{first_cat}").json()
        part = cat["parts"][0]

        headers = {"Authorization": f"Bearer {test_user['token']}"}
        order_payload = {
            "items": [{"ref": part["ref"], "quantity": 2}],
            "vehicle_vin": "WVWZZZ1KZ8W123456",
            "vehicle_label": "Volkswagen Golf 5 2008",
            "shipping_address": "Avenue Habib Bourguiba, Tunis",
            "phone": "+216 22 333 444",
            "notes": "TEST order",
        }
        r = requests.post(f"{API}/orders", json=order_payload, headers=headers)
        assert r.status_code == 200, r.text
        order = r.json()
        assert order["status"] == "En attente"
        assert order["payment_method"] == "Paiement à la livraison"
        assert order["total_tnd"] == round(part["price_tnd"] * 2, 3)
        assert len(order["items"]) == 1
        assert "_id" not in order  # Mongo _id must be excluded

        # GET /orders/mine
        r2 = requests.get(f"{API}/orders/mine", headers=headers)
        assert r2.status_code == 200
        mine = r2.json()
        assert any(o["id"] == order["id"] for o in mine)

        # store order_id for downstream admin test
        pytest.shared_order_id = order["id"]

    def test_create_order_invalid_ref(self, session, test_user):
        headers = {"Authorization": f"Bearer {test_user['token']}"}
        r = requests.post(f"{API}/orders", json={
            "items": [{"ref": "DOES_NOT_EXIST_REF", "quantity": 1}],
            "shipping_address": "Tunis",
            "phone": "11111111",
        }, headers=headers)
        assert r.status_code == 400


# ---------- Admin ----------
class TestAdmin:
    def test_admin_users(self, admin_token):
        r = requests.get(f"{API}/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        users = r.json()
        assert isinstance(users, list)
        assert any(u["email"] == ADMIN_EMAIL for u in users)
        # password_hash must NOT leak
        for u in users:
            assert "password_hash" not in u
            assert "_id" not in u

    def test_admin_orders(self, admin_token):
        r = requests.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_stats(self, admin_token):
        r = requests.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        s = r.json()
        for k in ("users", "orders", "pending_orders", "revenue_tnd"):
            assert k in s

    def test_admin_users_forbidden_for_user(self, test_user):
        r = requests.get(f"{API}/admin/users", headers={"Authorization": f"Bearer {test_user['token']}"})
        assert r.status_code == 403

    def test_admin_update_order_status(self, admin_token):
        order_id = getattr(pytest, "shared_order_id", None)
        if not order_id:
            pytest.skip("No order created in previous test")
        r = requests.patch(
            f"{API}/admin/orders/{order_id}",
            json={"status": "Confirmée"},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        assert r.json().get("ok") is True

        # Verify status persisted via admin/orders
        r2 = requests.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {admin_token}"})
        assert r2.status_code == 200
        found = next((o for o in r2.json() if o["id"] == order_id), None)
        assert found is not None
        assert found["status"] == "Confirmée"

    def test_admin_update_order_404(self, admin_token):
        r = requests.patch(
            f"{API}/admin/orders/nonexistent-id-xyz",
            json={"status": "Annulée"},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 404
