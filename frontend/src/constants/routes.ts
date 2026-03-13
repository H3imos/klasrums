const routes = {
  ROOT: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  OVERVIEW: "/overview",

  get CLASSROOMS() {
    return `${this.OVERVIEW}/classrooms`;
  },
  get CLASSROOM_DETAIL() {
    return `${this.CLASSROOMS}/:classroomId`;
  },
  get CLASSROOM_DETAIL_ACTIVITIES() {
    return `${this.CLASSROOM_DETAIL}/activities`;
  },
  get CLASSROOM_DETAIL_SCORES() {
    return `${this.CLASSROOM_DETAIL}/scores`;
  },
  get CLASSROOM_DETAIL_STUDENTS() {
    return `${this.CLASSROOM_DETAIL}/students`;
  },
  get CLASSROOM_DETAIL_ATTENDANCES() {
    return `${this.CLASSROOM_DETAIL}/attendances`;
  },
};

export default Object.freeze(routes);
