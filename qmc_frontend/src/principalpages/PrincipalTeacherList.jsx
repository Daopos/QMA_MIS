import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap"; // Import Pagination
import axiosClientPrincipal from "../axoisclient/axios-client-principal";
import SearchIcon from "@mui/icons-material/Search";

export default function PrincipalTeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const teachersPerPage = 5; // Number of teachers per page

    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        axiosClientPrincipal
            .get("/teachers-list")
            .then((response) => {
                setTeachers(response.data);
                setFilteredTeachers(response.data); // Initialize with all teachers
            })
            .catch((error) => console.error("Error fetching teachers:", error));
    }, []);

    const handleShowModal = (teacher) => {
        setSelectedTeacher(teacher);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTeacher(null);
        setShowModal(false);
    };

    // Handle search functionality
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = teachers.filter((teacher) =>
            `${teacher.fname} ${teacher.lname}`.toLowerCase().includes(query)
        );
        setFilteredTeachers(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };

    // Pagination calculations
    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = filteredTeachers.slice(
        indexOfFirstTeacher,
        indexOfLastTeacher
    );

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
        const pageRange = 2; // Number of pages to show on either side of the current page
        const items = [];

        // Add "First" button
        items.push(
            <Pagination.First
                key="first"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
            />
        );

        // Add "Prev" button
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        // Calculate the start and end page for the page numbers
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (totalPages <= 2 * pageRange + 1) {
            // Show all pages if total pages are small
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => setCurrentPage(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            // Show "First" page if needed
            if (currentPage > pageRange + 2) {
                items.push(
                    <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
                        1
                    </Pagination.Item>
                );
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }

            // Add pages around the current page
            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => setCurrentPage(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            // Show "Last" page if needed
            if (currentPage < totalPages - pageRange - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
                items.push(
                    <Pagination.Item
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {totalPages}
                    </Pagination.Item>
                );
            }
        }

        // Add "Next" button
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        // Add "Last" button
        items.push(
            <Pagination.Last
                key="last"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
            />
        );

        return <Pagination>{items}</Pagination>;
    };

    return (
        <div className="list-body-container">
            <div>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <Button
                    className="search-input-btn"
                    variant="outline-secondary"
                >
                    <SearchIcon />
                </Button>
            </div>
            <div className="list-container">
                <div className="d-flex justify-content-between list-title-container">
                    <h2>Teacher List</h2>
                </div>
                <table className="list-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Teacher Name</th>
                            <th>Class Advisory</th>
                            <th>Subjects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentTeachers) &&
                        currentTeachers.length > 0 ? (
                            currentTeachers.map((teacher, i) => (
                                <tr key={teacher.id}>
                                    <td>
                                        {
                                            indexOfFirstTeacher +
                                                i +
                                                1 /* Calculate row number */
                                        }
                                    </td>
                                    <td>
                                        {teacher.lname}, {teacher.fname}
                                        {teacher.mname
                                            ? ` ${teacher.mname[0]}.`
                                            : ""}
                                    </td>
                                    <td>
                                        {teacher.advisory_class
                                            ? `Grade ${teacher.advisory_class.grade_level} - ${teacher.advisory_class.title}`
                                            : "N/A"}
                                    </td>
                                    <td>
                                        <button
                                            className="button-list button-blue"
                                            variant="primary"
                                            onClick={() =>
                                                handleShowModal(teacher)
                                            }
                                        >
                                            View Subjects
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No teachers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                {renderPagination()}
            </div>

            {/* Modal for showing subjects and schedules */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Subjects and Schedules</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTeacher ? (
                        selectedTeacher.subjects &&
                        selectedTeacher.subjects.length > 0 ? (
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Classroom</th>
                                        <th>Subject</th>
                                        <th>Schedules</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTeacher.subjects.map((subject) => (
                                        <tr key={subject.id}>
                                            <th>
                                                Grade{" "}
                                                {subject.classroom.grade_level}{" "}
                                                -{subject.classroom.title}
                                            </th>
                                            <td>{subject.title}</td>
                                            <td>
                                                {subject.schedules &&
                                                subject.schedules.length > 0 ? (
                                                    subject.schedules.map(
                                                        (schedule) => (
                                                            <div
                                                                key={
                                                                    schedule.id
                                                                }
                                                            >
                                                                {schedule.day} -{" "}
                                                                {schedule.start}{" "}
                                                                to{" "}
                                                                {schedule.end}
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div>No Schedules</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No subjects available.</p>
                        )
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
