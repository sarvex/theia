// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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

import { RequestService } from '@theia/core/shared/@theia/request';
import type { interfaces } from '@theia/core/shared/inversify';
import { OVSXClient, OVSXHttpClient } from '@theia/ovsx-client';
import { VSXEnvironment } from './vsx-environment';

export const OVSXClientProvider = Symbol('OVSXClientProvider') as symbol & interfaces.Abstract<OVSXClientProvider>;
export type OVSXClientProvider = () => Promise<OVSXClient>;

export const OVSXClientFactory = Symbol('OVSXClientFactory') as symbol & interfaces.Abstract<OVSXClientFactory>;
export type OVSXClientFactory = (url: string) => OVSXClient;

/**
 * @deprecated since 1.32.0
 */
export async function createOVSXClient(vsxEnvironment: VSXEnvironment, requestService: RequestService): Promise<OVSXClient> {
    const apiUrl = await vsxEnvironment.getRegistryApiUri();
    return new OVSXHttpClient(apiUrl, requestService);
}
