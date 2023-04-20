// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics, Ericsson, ARM, EclipseSource and others.
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

import { inject, injectable } from 'inversify';
import { ElectronWindows } from '../../electron-common';
import { DefaultSecondaryWindowService } from '../../browser/window/default-secondary-window-service';

@injectable()
export class ElectronSecondaryWindowService extends DefaultSecondaryWindowService {

    @inject(ElectronWindows)
    protected electronWindows: ElectronWindows;

    override focus(win: Window): void {
        this.electronWindows.focusWindow(win.name);
    }

    protected override doCreateSecondaryWindow(onClose?: (closedWin: Window) => void): Window | undefined {
        const secondaryWindow = super.doCreateSecondaryWindow(onClose);
        if (secondaryWindow) {
            this.electronWindows.setMenuBarVisible(false, secondaryWindow.name);
        }
        return secondaryWindow;
    }
}
