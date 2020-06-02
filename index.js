const express = require("express");
const app = express();
const expressGraphQL = require("express-graphql");
const students = require("./students.json");
const grades = require("./grades.json");
const courses = require("./courses.json");
const StudentType = require("./types/StudentType");
const CourseType = require("./types/CourseType");
const GradeType = require("./types/GradeType");
const _ = require("lodash");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError,
} = require("graphql");

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation.",
  fields: () => ({
    addCourse: {
      type: CourseType,
      description: "Add a course.",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const course = {
          id: courses.length + 1,
          name: args.name,
          description: args.description,
        };
        courses.push(course);
        return course;
      },
    },
    addStudent: {
      type: StudentType,
      description: "Add a student.",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const { name, lastName, courseId } = args;
        const exist = courses.some((course) => course.id === courseId);
        if (!exist) {
          throw new GraphQLError(
            `Bad request: the course with id: ${courseId} doesn't exist.`
          );
        }
        console.log(exist);
        const student = {
          id: students.length + 1,
          name: name,
          lastName: lastName,
        };
        students.push(student);
        return student;
      },
    },
    addGrade: {
      type: GradeType,
      description: "Add a grade of a student.",
      args: {
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        studentId: { type: GraphQLNonNull(GraphQLInt) },
        grade: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const { courseId, studentId, grade } = args;

        const existStudentAndCourse = students.some(
          (student) => student.id === studentId && student.courseId === courseId
        );

        if (!existStudentAndCourse) {
          throw new GraphQLError(
            `Bad request: the student does not belong to the course, or the student with id: ${studentId} or the course with id: ${courseId} doesn't exist.`
          );
        } else {
          const gradeObject = {
            id: grades.length + 1,
            courseId: courseId,
            studentId: studentId,
            grade: grade,
          };
          grades.push(gradeObject);
          return gradeObject;
        }
      },
    },
    deleteStudent: {
      type: StudentType,
      description: "Delete a student",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const id = args.id;
        const studentExist = students.some((student) => student.id === id);
        if (!studentExist) {
          throw new GraphQLError(
            `Bad request: the student with id: ${id} doesn't exist`
          );
        } else {
          _.remove(students, (student) => {
            return student.id === id;
          });
        }
      },
    },

    deleteCourse: {
      type: CourseType,
      description: "Delete a course",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const id = args.id;
        const courseExist = courses.some((course) => course.id === id);
        if (!courseExist) {
          throw new GraphQLError(
            `Bad request: the course with id: ${id} doesn't exist`
          );
        } else {
          const studentExist = students.some(
            (student) => student.courseId === id
          );
          if (!studentExist) {
            _.remove(courses, (course) => {
              return course.id === id;
            });
          } else {
            throw new GraphQLError(
              `Bad request: the course with id: ${id} can't be remove`
            );
          }
        }
      },
    },

    deleteGrade: {
      type: GradeType,
      description: "Delete a grade",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const id = args.id;
        const gradeExist = grades.some((grade) => grade.id === id);
        if (!gradeExist) {
          throw new GraphQLError(
            `Bad request: the grade with id: ${id} doesn't exist`
          );
        } else {
          _.remove(grades, (grade) => {
            return grade.id === id;
          });
        }
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    sutudents: {
      type: new GraphQLList(StudentType),
      description: "List of all students.",
      resolve: () => students,
    },
    grades: {
      type: new GraphQLList(GradeType),
      description: "List of all grades.",
      resolve: () => grades,
    },
    courses: {
      type: new GraphQLList(CourseType),
      description: "List of all courses.",
      resolve: () => courses,
    },
    student: {
      type: StudentType,
      description: "Particular student.",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        students.find((student) => args.id === student.id),
    },
    grade: {
      type: GradeType,
      description: "Particular grade.",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => grades.find((grade) => args.id === grade.id),
    },
    course: {
      type: CourseType,
      description: "Particular course.",
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
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
    customFormatErrorFn: (error) => {
      return error;
    },
  })
);

app.listen(3000, () => {
  console.log("Server running");
});
