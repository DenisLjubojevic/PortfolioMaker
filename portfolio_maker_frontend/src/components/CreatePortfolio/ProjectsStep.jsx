import PropTypes from 'prop-types';

function ProjectsStep({ data, setData }) {
    const handleAddProject = () => {
        setData([...data, {title: '', description: '', technologies: [], demoUrl: '', repoUrl: '' }]);
    };

    const handleChange = (index, field, value) => {
        const updateProjects = data.map((project, i) =>
            i === index ? { ...project, [field]: value } : project
        );
        setData(updateProjects);
    };

    return (
        <div>
            <h2>Projects</h2>
            {data.map((project, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                    />
                    <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Technologies"
                        value={project.technologies.join(', ')}
                        onChange={(e) => handleChange(index, 'technologies', e.target.value.split(',').map(tech => tech.trim()))}
                    />
                    <input
                        type="text"
                        placeholder="Demo URL"
                        value={project.demoUrl}
                        onChange={(e) => handleChange(index, 'demoUrl', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Repo URL"
                        value={project.repoUrl}
                        onChange={(e) => handleChange(index, 'repoUrl', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleAddProject}>Add Project</button>
        </div>
    ); 
}

ProjectsStep.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            demoUrl: PropTypes.string,
            repoUrl: PropTypes.string,
        })
    ).isRequired,
    setData: PropTypes.func.isRequired,
}

export default ProjectsStep;