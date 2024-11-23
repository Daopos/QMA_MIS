import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClientTeacher from "../axoisclient/axois-client-teacher";
import ViewStudentSubmission from "./ViewStudentSubmission";
import { useQuery } from "react-query";

export default function TeacherTestSubmission() {
    const { testId } = useParams();

    const [showModal, setShowModal] = useState(false);

    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const handleClose = () => {
        setShowModal(false);
    };

    const {
        data: submissions = [],
        loading,
        error,
    } = useQuery(["testSubmissions", testId], async () => {
        const { data } = await axiosClientTeacher.get(
            `/test/${testId}/submissions`
        );

        console.log(data);
        return data;
    });

    return (
        <>
            <div className=" p-3 ">
                <div className="list-container">
                    <div className="d-flex justify-content-between list-title-container">
                        <h2>Test Submissions</h2>
                    </div>
                    <div>
                        <table className="list-table">
                            <thead>
                                <tr>
                                    <th>Student LRN</th>
                                    <th>Student Name</th>
                                    <th>Submission Date</th>
                                    <th>Score</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission, index) => (
                                    <tr key={index}>
                                        <td>{submission.student.lrn}</td>
                                        <td>{`${submission.student.surname}, ${submission.student.firstname} `}</td>
                                        <td>
                                            {new Date(
                                                submission.created_at
                                            ).toLocaleString()}
                                        </td>
                                        <td>{submission.total_score}</td>
                                        <td>
                                            <button
                                                className="button-list button-blue"
                                                onClick={() => {
                                                    setSelectedStudentId(
                                                        submission.student.id
                                                    );
                                                    setShowModal(true);
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ViewStudentSubmission
                    show={showModal}
                    handleClose={handleClose}
                    testId={testId}
                    studentId={selectedStudentId}
                />
            </div>
        </>
    );
}
