export enum statusEnum {
  "incomplete",
  "complete"
}

export type Doodle = {
    id: number,
    title: string,
    body: string,
    status: statusEnum,
    deadline: string,
    tags?: string,
    completed?: string,
    updated: string,
}

export type DoodleTag = {
  id: number,
  tag_name: string
}
