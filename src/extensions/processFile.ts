import { GluegunTemplate } from 'gluegun'
import { IFile } from '../types'
import process = require('process')

const processFiles = async (
  files: IFile[],
  targetPath: string,
  screenName: string,
  template: GluegunTemplate
): Promise<void> => {
  const basePath = process.cwd()
  const folderName = 'create_structures'
  const templates = 'templates'

  for (const { name, template: templateFile } of files) {
    await template.generate({
      directory: `${basePath}/${folderName}/${templates}/${templateFile}`,
      template: '',
      target: `${targetPath}/${name}`,
      props: { screenName: screenName.toLowerCase() },
    })
  }
}

export default processFiles
