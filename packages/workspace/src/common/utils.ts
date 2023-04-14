// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

// TODO get rid of util files, replace with methods in a responsible class

import URI from '@theia/core/lib/common/uri';
import { injectable } from '@theia/core/shared/inversify';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { MaybePromise } from '@theia/core';

/**
 * @deprecated Since 1.37.0. Use `CommonWorkspaceUtils#getWorkspaceExtension` instead.
 */
export const THEIA_EXT = 'theia-workspace';
export const VSCODE_EXT = 'code-workspace';

@injectable()
export class CommonWorkspaceUtils {
    /**
     * Check if the file should be considered as a workspace file.
     *
     * Example: We should not try to read the contents of an .exe file.
     */
    isWorkspaceFile(candidate: FileStat | URI): boolean {
        const uri = FileStat.is(candidate) ? candidate.resource : candidate;
        return uri.path.ext === `.${this.getWorkspaceExtension()}` || (this.isVSCodeWorkspaceSelectionEnabled() && uri.path.ext === `.${VSCODE_EXT}`);
    }

    isUntitledWorkspace(candidate?: URI): boolean {
        return !!candidate && this.isWorkspaceFile(candidate) && candidate.path.base.startsWith('Untitled');
    }

    /**
     * Determines whether the workspace service allows to select `.code-workspace` as valid workspaces for the application.
     *
     * If this method returns `false`, only workspace file that fit the `CommonWorkspaceUtils#getWorkspaceExtension` return value can be selected.
     */
    isVSCodeWorkspaceSelectionEnabled(): boolean {
        return true;
    }

    /**
     * Returns the file extension used for all workspace files for this application.
     *
     * Returns `theia-workspace` by default.
     */
    getWorkspaceExtension(): string {
        return THEIA_EXT;
    }

    async getUntitledWorkspaceUri(configDirUri: URI, isAcceptable: (candidate: URI) => MaybePromise<boolean>, warnOnHits?: () => unknown): Promise<URI> {
        const parentDir = configDirUri.resolve('workspaces');
        let uri;
        let attempts = 0;
        do {
            attempts++;
            uri = parentDir.resolve(`Untitled-${Math.round(Math.random() * 1000)}.${this.getWorkspaceExtension()}`);
            if (attempts === 10) {
                warnOnHits?.();
            }
            if (attempts === 50) {
                throw new Error('Workspace Service: too many attempts to find unused filename.');
            }
        } while (!(await isAcceptable(uri)));
        return uri;
    }
}
