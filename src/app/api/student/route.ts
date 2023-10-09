import { getPrisma } from "@/libs/getPrisma";
import { Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export type StudentGetResponse = {
  students: Student[];
};

export const GET = async () => {
  const prisma = getPrisma();

  //2. Display list of student
  // const students = await prisma...
  const students = await prisma.student.findMany({
    orderBy: {
      studentId: 'asc'
    },
  });

  return NextResponse.json<StudentGetResponse>({
    students: students, //replace empty array with result from DB
  });
};

export type StudentPostOKResponse = { ok: true };
export type StudentPostErrorResponse = { ok: false; message: string };
export type StudentPostResponse =
  | StudentPostOKResponse
  | StudentPostErrorResponse;

export type StudentPostBody = Pick<
  Student,
  "studentId" | "firstName" | "lastName"
>;

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as StudentPostBody;
  const prisma = getPrisma();

  //4. Add new Student data
  // await prisma...
  const existsStudents = await prisma.student.findUnique({
    where: { studentId: body.studentId },
  });
  
  // return NextResponse.json<StudentPostErrorResponse>(
  //   { ok: false, message: "Student Id already exists" },
  //   { status: 400 }
  // );
  if(existsStudents){
    return NextResponse.json<StudentPostErrorResponse>(
         { ok: false, message: "Student Id already exists" },
         { status: 400 }
     );
  }

  const newStudents = await prisma.student.create({
    data: {
      studentId: body.studentId,
      firstName: body.firstName,
      lastName: body.lastName,
    },
  }); 


  // return NextResponse.json<StudentPostOKResponse>({ ok: true });
  return NextResponse.json<StudentPostOKResponse>({ok: true});
};
