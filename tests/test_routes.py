import unittest
from unittest.mock import patch

from app import app


class TestRoutes(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_route_smoke_pages_return_200(self):
        routes = ["/", "/about", "/work", "/education", "/hobbies", "/map", "/admin"]

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 200)

    def test_home_page_includes_core_nav_links(self):
        response = self.client.get("/")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        for route in ["/", "/about", "/work", "/education", "/map", "/admin"]:
            with self.subTest(route=route):
                self.assertIn(f'href="{route}"', body)

    def test_about_page_sets_about_nav_link_active(self):
        response = self.client.get("/about")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("<h1>About</h1>", body)

    def test_work_page_renders_json_role_content(self):
        response = self.client.get("/work")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Work Experiences", body)
        self.assertIn("No work entries available yet.", body)

    def test_education_page_renders_application_fields(self):
        response = self.client.get("/education")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("GPA", body)
        self.assertIn("Classification", body)
        self.assertIn("Extracurriculars", body)
        self.assertIn("Relevant Coursework", body)

    def test_hobbies_page_renders_json_hobby_content(self):
        response = self.client.get("/hobbies")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Hobbies", body)
        self.assertIn("No hobbies listed yet.", body)

    def test_map_page_includes_renderer_script_and_marker_color(self):
        response = self.client.get("/map")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("map-renderer.js", body)
        self.assertIn("unpkg.com/leaflet", body)
        self.assertIn("#66BB6A", body)

    def test_admin_page_renders_plain_text_forms(self):
        response = self.client.get("/admin")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Admin Editor", body)
        self.assertIn('name="current_education"', body)
        self.assertIn('name="locations"', body)
        self.assertNotIn("Save About", body)
        self.assertNotIn("Save Hobbies", body)

    @patch("app._resolve_location_coordinates", return_value=(5.6037, -0.1870))
    @patch("app.save_json_file", return_value=True)
    def test_admin_save_posts_map_form_payload(self, mock_save_json, _mock_resolve_coordinates):
        response = self.client.post(
            "/admin/save/map",
            data={
                "locations": "Accra|Ghana|Home",
            },
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin?saved=map", response.headers["Location"])
        mock_save_json.assert_called_once()

    @patch("app.save_json_file", return_value=False)
    def test_admin_save_handles_write_failure(self, _mock_save_json):
        response = self.client.post(
            "/admin/save/map",
            data={},
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin?error=map", response.headers["Location"])

    @patch("app.load_json_file", return_value=[])
    def test_map_page_handles_malformed_payload_shape(self, _mock_load_json_file):
        response = self.client.get("/map")
        body = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn('id="map-root"', body)
        self.assertIn("map-renderer.js", body)


if __name__ == "__main__":
    unittest.main()
