from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/muscle')
def muscle_map():
    return render_template('muscle.html')

@app.route('/muscle/<muscle_name>')
def muscle_page(muscle_name):
    # for now, just render a simple detail page
    return render_template('muscle_detail.html',
                           muscle_name=muscle_name)

@app.route('/quiz')
def quiz():
    # you'll create templates/quiz.html next
    return render_template('quiz.html')

if __name__ == '__main__':
    app.run(debug=True)