import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import ChoiceQuiz from "../components/ChoiceQuiz";
import Baseline from "../components/Baseline";
import Quiz from "../components/Quiz";
import Mimicking from "../components/Mimicking";
import Production from "../components/Production";
import filterLessonWords from "../helper/lessonWords";

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: {},
    };
    this.sendScore = this.sendScore.bind(this);
    this.loadLesson = this.loadLesson.bind(this);
  }

  async loadLesson() {
    const { match, activeLang } = this.props;
    const { name } = match.params;

    try {
      const lesson = await (await fetch(`/api/lessons/${name}`)).json();
      const safeWords = filterLessonWords(lesson, activeLang || "");
      this.setState({ lesson: { ...lesson, words: safeWords } });
    } catch (ex) {
      console.log(ex);
      this.setState({ lesson: {} });
    }
  }

  componentDidMount() {
    this.loadLesson();
  }

  componentDidUpdate(prevProps) {
    const { match, activeLang } = this.props;
    const previousName = prevProps.match && prevProps.match.params
      ? prevProps.match.params.name
      : "";
    const nextName = match && match.params ? match.params.name : "";

    if (
      previousName !== nextName ||
      prevProps.activeLang !== activeLang
    ) {
      this.loadLesson();
    }
  }

  sendScore(score, sumTotal, recordings) {
    const { match, user } = this.props;

    fetch("/api/quizScores/add/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson: match.params.name,
        user,
        score,
        maxScore: sumTotal,
        recordings: recordings || "",
      }),
    });
  }

  render() {
    const { match, baseline, setBaseline, user } = this.props;
    const { lesson } = this.state;
    const { name, activityNumber } = match.params;
    const words = Array.isArray(lesson.words) ? lesson.words : [];

    if (words.length === 0) {
      return (
        <div>
          <h3>
            Lesson:
            {name}
          </h3>
          <p>No activity content is available for this lesson yet.</p>
        </div>
      );
    }

    return (
      <div>
        <h3>
          Lesson:
          {name}
        </h3>
        <h2 id="header-activity">
          Activity
          {activityNumber}
        </h2>
        <Route path={`/lessons/${name}/1`}>
          <ChoiceQuiz stimuli={words} choices="2" />
        </Route>
        <Route path={`/lessons/${name}/2`}>
          <ChoiceQuiz stimuli={words} choices="4" />
        </Route>
        <Route path={`/lessons/${name}/3`}>
          {Boolean(baseline) === false ? (
            <Baseline outputFunction={setBaseline} />
          ) : (
            <Mimicking lesson={{ ...lesson, words }} />
          )}
        </Route>
        <Route path={`/lessons/${name}/4`}>
          {Boolean(baseline) === false ? (
            <Baseline outputFunction={setBaseline} />
          ) : (
            <Production lessonWords={words} />
          )}
        </Route>
        <Route path={`/lessons/${name}/quiz`}>
          <Quiz
            activities={lesson.quizSections}
            stimuli={words}
            lesson={{ ...lesson, words }}
            username={user}
            sendScore={this.sendScore}
          />
        </Route>
      </div>
    );
  }
}

Activity.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string.isRequired,
      activityNumber: PropTypes.string,
    }).isRequired,
  }).isRequired,
  activeLang: PropTypes.string,
  baseline: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  setBaseline: PropTypes.func,
  user: PropTypes.string,
};

Activity.defaultProps = {
  activeLang: "",
  baseline: false,
  setBaseline: () => {},
  user: "",
};

export default Activity;
