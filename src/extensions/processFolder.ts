import { IFolder } from '../types'
import processFiles from './processFile'
import { GluegunFilesystem, GluegunTemplate } from 'gluegun'

const processFolders = async (
  folders: IFolder[],
  basePath: string,
  screenName: string,
  filesystem: GluegunFilesystem,
  template: GluegunTemplate
): Promise<void> => {
  for (const folder of folders) {
    if (!folder.name) continue

    const folderPath = `${basePath}/${folder.name}`
    filesystem.dir(folderPath)

    if (folder.files) {
      await processFiles(folder.files, folderPath, screenName, template)
    }

    if (folder.childrenFolder) {
      for (const child of folder.childrenFolder) {
        if (!child.nameFolder) continue

        const childPath = `${folderPath}/${child.nameFolder}`
        filesystem.dir(childPath)

        if (child.files) {
          await processFiles(child.files, childPath, screenName, template)
        }
      }
    }
  }
}

export default processFolders
