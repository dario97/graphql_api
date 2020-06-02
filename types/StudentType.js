const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const CourseType = require("./CourseType");
const courses = require("../courses.json");

const StudentType = new GraphQLObjectType({
  name: "Student",
  description: "Represent a student",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    courseId: { type: GraphQLNonNull(GraphQLInt) },
    course: {
      type: CourseType,
      resolve: (student) => {
        return courses.find((course) => student.courseId === course.id);
      },
    },
  }),
});

module.exports = StudentType;
