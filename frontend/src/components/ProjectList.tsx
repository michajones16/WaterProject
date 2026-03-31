import { useEffect, useState } from "react";
import type { Project } from "../types/Project";
import { useNavigate } from "react-router-dom";

function ProjectList({selectedCategories} : {selectedCategories: string[]}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const categoryParams = selectedCategories
                .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
                .join('&');

            const reponse = await fetch(
                `https://localhost:5000/Water/AllProjects?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
            );
            const data = await reponse.json();
            setProjects(data.projects);
            setTotalItems(data.numProjects);
            setTotalPages(Math.ceil(totalItems / pageSize));
        }
        fetchProjects();
    }, [pageSize, pageNum, totalItems, selectedCategories]);

    return (
        <>
            <br />
            {projects.map((project) => (
                <div key={project.projectId} id="projectCard" className="card">
                    <h2>{project.projectName}</h2>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Type:</strong> {project.projectType}</li>
                            <li><strong>Regional Program:</strong> {project.projectRegionalProgram}</li>
                            <li><strong>Impact:</strong> {project.projectImpact} Individuals Served</li>
                            <li><strong>Project Phase:</strong> {project.projectPhase}</li>
                            <li><strong>Project Status:</strong> {project.projectFunctionalityStatus}</li>
                        </ul>

                        <button
                            className="btn btn-success"
                            onClick={() => navigate(`/donate/${project.projectName}`)}
                        >
                            Donate
                        </button>
                    </div>
                </div>
            ))}

            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
                Previous
            </button>

            {
                [...Array(totalPages)].map((_, index) => (
                    <button key={index} onClick={() => setPageNum(index + 1)} disabled={pageNum === index + 1}>
                        {index + 1}
                    </button>
                ))
            }

            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>
                Next
            </button>

            <br />
            <label>
                Results per page:
                <select
                    value={pageSize}
                    onChange={(p) => {
                        setPageSize(Number(p.target.value))
                        setPageNum(1);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    )
}

export default ProjectList;