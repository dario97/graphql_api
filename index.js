const express = require("express");
const app = express();
const expressGraphQL = require("express-graphql");
const students = require("./students.json");
const grades = require("./grades.json");
const courses = require("./courses.json");
const StudentType = require("./types/StudentType");
const CourseType = require("./types/CourseType");
const GradeType = require("./types/GradeType");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    sutudents: {
      type: new GraphQLList(StudentType),
      description: "List of all students",
      resolve: () => students,
    },
    grades: {
      type: new GraphQLList(GradeType),
      description: "List of all grades",
      resolve: () => grades,
    },
    courses: {
      type: new GraphQLList(CourseType),
      description: "List of all courses",
      resolve: () => courses,
    },
    student: {
      type: StudentType,
      description: "Particular student",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        students.find((student) => args.id === student.id),
    },
    grade: {
      type: GradeType,
      description: "Particular grade",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => grades.find((grade) => args.id === grade.id),
    },
    course: {
      type: CourseType,
      description: "Particular course",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        courses.find((course) => args.id === course.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server running");
});
