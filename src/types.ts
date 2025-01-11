export interface IFile {
  name: string
  template: string
}

export interface IChildrenFolder {
  nameFolder: string
  files: IFile[]
}

export interface IFolder {
  name: string
  files?: IFile[]
  childrenFolder?: IChildrenFolder[]
}

export type IStructure = {
  [key: string]: {
    files?: IFile[]
    folders?: IFolder[]
  }
}
