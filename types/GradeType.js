const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const StudentType = require("./StudentType");
const CourseType = require("./CourseType");

const GradeType = new GraphQLObjectType({
  name: "Grade",
  description: "Represent a grade of a student",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    courseId: { type: GraphQLNonNull(GraphQLInt) },
    studentId: { type: GraphQLNonNull(GraphQLInt) },
    grade: { type: GraphQLNonNull(GraphQLInt) },
    course: {
      type: CourseType,
      resolve: (grade) => {
        return courses.find((course) => grade.courseId === course.id);
      },
    },
    student: {
      type: StudentType,
      resolve: (grade) => {
        return students.find((student) => grade.studentId === student.id);
      },
    },
  }),
});

module.exports = GradeType;
