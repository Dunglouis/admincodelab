import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutAdmin from "../components/layout/layout";
import CourseCreation from "../components/createCourses/courses";
import CourseForm from "../components/createCourses/create_courses";
import Blog from "../components/blog/blog";
import Users from "../components/user/user";
import { Tools } from "../components/tools/tools";
import { Comment } from "../components/comment/comment";
import BlogForm from "../components/blog/create_blog";
import { Dashboard } from "../components/dashboard/dashboard";
import { Help } from "../components/help/help";
import Calendar from "../components/calendar/calendar";
import { FormAddUser } from "../components/user/form_add_admin";
import { Lesson } from "../components/lesson/lesson";
import { DetailsCourse } from "../components/lesson/detail";
import LessonForm from "../components/lesson/lessonform";
import { ExerciseForm } from "../components/lesson/exerciseform";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutAdmin />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/lesson/details" element={<DetailsCourse />} />
        <Route path="/lesson/form" element={<LessonForm />} />
        <Route path="/lesson/formEx" element={<ExerciseForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/user" element={<Users />} />
        <Route path="/user/add_user" element={<FormAddUser />} />
        <Route path="/course" element={<CourseCreation />} />
        <Route path="/course/create_courses" element={<CourseForm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/create_blog" element={<BlogForm />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/help" element={<Help />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
