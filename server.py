from flask import Flask, render_template, abort, redirect, url_for
from muscle_data import muscles
from quiz_questions import dropdown_questions
import uuid  # Add this import

app = Flask(__name__)

# Generate a unique session ID that changes on server reload
SESSION_ID = str(uuid.uuid4())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/muscle')
def muscle_map():
    return render_template('muscle.html', session_id=SESSION_ID)  # Pass session ID to template

@app.route('/muscle/<muscle_name>/page/<int:page>')
def muscle_page(muscle_name, page):
    muscle = muscles.get(muscle_name)
    if not muscle:
        abort(404)

    # Render the correct template based on the step/page
    try:
        return render_template(f'muscle_page_{page}.html', muscle=muscle, muscle_name=muscle_name)
    except:
        abort(404)

@app.route('/quiz')
def quiz():
    # The original standalone quiz was replaced by the training game.
    return redirect(url_for('quizgame'))


@app.route('/quizgame')
def quizgame():
    return render_template('quizgame.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)