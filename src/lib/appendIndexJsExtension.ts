import path from "path";
import { statOrUndefined } from "./util";

export const shouldAppendIndexJsExtension = async (
    importingFilePathname: string,
    importSpecifier: string,
  ): Promise<boolean> => {
    if (!importingFilePathname.endsWith('.js')) {
      return false;
    }
  
    const importSpecifierParts = importSpecifier.split('/');
  
    if (
      importSpecifierParts[importSpecifierParts.length - 1]
        .includes('.')
    ) {
      // there may be an extension specified,
      // so we won't touch the import
      return false;
    }
  
    const importingFileDirectory = path.dirname(
      importingFilePathname,
    );
  
    // TODO handle 'file:///' specifiers
    if (
      importSpecifier.startsWith('./')
        || importSpecifier.startsWith('../')
        || path.isAbsolute(importSpecifier)
    ) {
      // relative imports - yes I know a path starting with '/'
      // is actually absolute, but they are treated the same by Node's
      // resolution algorithm
      const resolvedSpecifierWithoutExt = path.isAbsolute(
        importSpecifier,
      ) ? importSpecifier
        : path.join(
          importingFileDirectory,
          importSpecifier,
        );
  
      // Check if the resolved specifier without extension exists as a directory.
      // If it does and there's an index.js file inside, return true.
      const resolvedSpecifierWithoutExtStat = await statOrUndefined(
        resolvedSpecifierWithoutExt,
      );
      if (
        resolvedSpecifierWithoutExtStat !== undefined
        && resolvedSpecifierWithoutExtStat.isDirectory()
      ) {
        const indexJsPath = path.join(
          resolvedSpecifierWithoutExt,
          'index.js',
        );
        const indexJsStat = await statOrUndefined(indexJsPath);
        return indexJsStat !== undefined && indexJsStat.isFile();
      }
    }
  
    return false;
  };
  