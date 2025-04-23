import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

#Each data item needs to have multiple fields. At the minimum, this must include:
# • An id
# • A short title or name for the item (movie title, restaurant name, etc)
# • A link to media (image, video, or gif).
# o For large media files, you must provide an external link (like a link to a youtube
# video). Do NOT download the file and submit it with the assignment because if
# you did that, it will take your grader forever to download all the assignments.
# • A text paragraph of explanation (At least 4 sentences)
# • Some sort of numerical data (a year, a price, a rating, etc.)
# • A list of some kind of data (such as a list of reviews for the movie, list of popular dishes
# at the restaurant, a list of similar restaurants nearby, etc)


@app.route('/')
def home():
    return render_template('index.html')

# Future path example for a specific muscle group:
@app.route('/muscle/<muscle_name>')
def muscle_page(muscle_name):
    return f"Info page for {muscle_name} (To be implemented)"

if __name__ == '__main__':
    app.run(debug=True)