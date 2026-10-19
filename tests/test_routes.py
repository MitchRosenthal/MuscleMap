import unittest
from server import app
from muscle_data import muscles

class RouteTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_public_pages(self):
        for path in ["/", "/muscle", "/quizgame", "/about"]:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_legacy_quiz_redirect(self):
        response = self.client.get("/quiz")
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/quizgame"))
        self.assertEqual(self.client.get("/quiz", follow_redirects=True).status_code, 200)

    def test_linked_lesson_pages(self):
        for muscle in muscles:
            for page in (1, 2, 4):
                with self.subTest(muscle=muscle, page=page):
                    self.assertEqual(self.client.get(f"/muscle/{muscle}/page/{page}").status_code, 200)

    def test_unknown_muscle(self):
        self.assertEqual(self.client.get("/muscle/not-a-muscle/page/1").status_code, 404)
