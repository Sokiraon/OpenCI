declare namespace Project {
    type Creation = {
        name: string;
        description: string;
        src: string;
        defaultBranch: string;
    };
    type Record = Creation & {
        id: number;
    };
    function create(data: Creation): Record;
    function getAll(): Record[];
    function getById(id: number): Record | undefined;
    function getByName(name: string): Record | undefined;
    function remove(id: number): void;
}
export default Project;
