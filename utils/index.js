module.exports = {
  validateEmail: (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return RegExp(emailRegex).test(email);
  },
  processQuestionsArray: (questionsArray) => questionsArray.map((question) => {
    const answersCopy = !question.answers ? [] : question.answers.reduce(
      (obj, answer) => {
        delete answer.question_id;
        Object.assign(obj, { [answer.id]: answer });
        return obj;
      },
      {},
    );
    question.answers = answersCopy;
    return question;
  }),
};
