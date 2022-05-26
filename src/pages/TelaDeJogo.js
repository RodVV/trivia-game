import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Components/Header';
import { fetchTrivia } from '../api/fetchAPI';
import Loading from './Loading';

export default class TelaDeJogo extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      perguntas: [],
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    const perguntasApi = await fetchTrivia();
    console.log(perguntasApi.response_code);
    if (perguntasApi.response_code !== 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('response');
      history.push('/');
    } else {
      console.log(token);
      this.setState({
        perguntas: perguntasApi.results,
      });
      console.log(this.state);
      this.renderQuestions();
    }
  }

  handleClick = () => {
    const { index } = this.state;
    const INDEX_NUMBER = 4;
    if (index < INDEX_NUMBER) {
      this.setState((prevState) => ({
        index: prevState.index + 1 }));
    } else {
      this.setState({
        index: 0,
      });
    }
  }

  renderQuestions() {
    const { perguntas, index } = this.state;
    const RANDOM_NUMBER = 0.5;
    const filterQuestions = Object.keys(perguntas).filter((key) => key.includes(index))
      .reduce((cur, key) => Object.assign(cur, { [key]: perguntas[key] }), {});
      // https://masteringjs.io/tutorials/fundamentals/filter-key#:~:text=JavaScript%20objects%20don't%20have,()%20function%20as%20shown%20below.
    console.log(filterQuestions);
    const correct = filterQuestions[index].correct_answer;
    const incorrects = [...filterQuestions[index].incorrect_answers];
    const answers = [correct, ...incorrects];
    const randomAnswers = answers.sort(() => Math.random() - RANDOM_NUMBER);
    // https://flaviocopes.com/how-to-shuffle-array-javascript/
    console.log(randomAnswers);
    return (
      <>
        <div key={ index }>
          <h1 data-testid="question-category">
            {filterQuestions[index].category}
          </h1>
        </div>
        <>
          <h2 data-testid="question-text">{filterQuestions[index].question}</h2>
          { randomAnswers.map((randomAnswer, answerIndex) => (
            <button
              key={ answerIndex }
              type="button"
              data-testid={ randomAnswer === correct
                ? 'correct-answer' : `wrong-answer-${answerIndex}` }
              onClick={ this.handleClick }
            >
              {randomAnswer}
            </button>
          ))}
        </>
      </>
    );
  }

  render() {
    const { perguntas } = this.state;
    return (
      <>
        <Header />
        { perguntas.length === 0 ? <Loading /> : (
          this.renderQuestions()
        )}

      </>
    );
  }
}

TelaDeJogo.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
