import { useEffect, useState } from "react";
import type { Project } from "../types/Project";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api/ProjectsAPI";
import Pagination from "./Pagination";

function ProjectList({selectedCategories} : {selectedCategories: string[]}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                const data = await fetchProjects(pageSize, pageNum, selectedCategories);
                setProjects(data.projects);
                setTotalPages(Math.ceil(data.numProjects / pageSize));
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, [pageSize, pageNum, selectedCategories]);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p className='text-red-500'>Error: {error}</p>;

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
                            onClick={() => navigate(`/donate/${project.projectName}/${project.projectId}`)}
                        >
                            Donate
                        </button>
                    </div>
                </div>
            ))}
            <Pagination
                currentPage = {pageNum}
                totalPages = {totalPages}
                pageSize = {pageSize}
                onPageChange = {setPageNum}
                onPageSizeChange = {(newSize) => {
                    setPageSize(newSize);
                    setPageNum(1);
                }}
            />
        </>
    )
}

export default ProjectList;