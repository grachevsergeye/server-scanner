export interface HttpInspection {

    status: number;

    headers: Record<string, string | string[] | undefined>;

    technologies: string[];

}