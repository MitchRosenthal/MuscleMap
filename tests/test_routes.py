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

    def test_standalone_quiz(self):
        self.assertEqual(self.client.get("/quiz").status_code, 200)

    def test_linked_lesson_pages(self):
        for muscle in muscles:
            for page in (1, 2, 4):
                with self.subTest(muscle=muscle, page=page):
                    self.assertEqual(self.client.get(f"/muscle/{muscle}/page/{page}").status_code, 200)

    def test_unknown_muscle(self):
        self.assertEqual(self.client.get("/muscle/not-a-muscle/page/1").status_code, 404)

    def test_referenced_assets_exist(self):
        from html.parser import HTMLParser
        assets = set()
        class AssetParser(HTMLParser):
            def handle_starttag(self, tag, attrs):
                for key, value in attrs:
                    if key in ("src", "href") and value and value.startswith("/static/"):
                        assets.add(value)
        paths = ["/", "/muscle", "/quiz", "/quizgame", "/about"]
        paths += [f"/muscle/{muscle}/page/{page}" for muscle in muscles for page in (1, 2, 4)]
        for path in paths:
            AssetParser().feed(self.client.get(path).get_data(as_text=True))
        for asset in assets:
            with self.subTest(asset=asset):
                self.assertEqual(self.client.get(asset).status_code, 200)
