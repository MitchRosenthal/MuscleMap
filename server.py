from flask import Flask, render_template, abort
from muscle_data import muscles

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/muscle')
def muscle_map():
    return render_template('muscle.html')

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
    # you'll create templates/quiz.html next
    return render_template('quiz.html')

@app.route('/quizgame')
def quizgame():
    return render_template('quizgame.html')

if __name__ == '__main__':
    app.run(debug=True)