/*
 * Copyright (c) 2018-2021 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { Store } from 'redux';
import createMockStore from 'redux-mock-store';
import { BrandingData } from '../../services/bootstrap/branding.constant';
import { FactoryResolver } from '../../services/helpers/types';
import { AppState } from '..';
import { State as DevfileRegistriesState } from '../DevfileRegistries/index';
import { ContainerCredentials, RegistryRow } from '../UserPreferences/types';
import { State as WorkspacesState } from '../Workspaces/index';
import { State as BannerAlertState } from '../BannerAlert';
import { State as BrandingState } from '../Branding';
import { State as FactoryResolverState } from '../FactoryResolver';
import { State as InfrastructureNamespaceState } from '../InfrastructureNamespaces';
import { State as PluginsState } from '../Plugins/chePlugins';
import { State as UserState } from '../User';
import { State as UserProfileState } from '../UserProfile';
import mockThunk from './thunk';
import { IDevWorkspace, IDevWorkspaceDevfile } from '@eclipse-che/devworkspace-client';

export class FakeStoreBuilder {

  private state: AppState = {
    bannerAlert: {
      messages: [],
    },
    factoryResolver: {
      isLoading: false,
      resolver: {},
    } as FactoryResolverState,
    plugins: {
      isLoading: false,
      plugins: [],
    } as PluginsState,
    workspaces: {
      isLoading: false,
      namespace: '',
      workspaceName: '',
      workspaceId: '',
      recentNumber: 5,
    } as WorkspacesState,
    cheWorkspaces: {
      isLoading: false,
      workspaces: [],
      workspacesLogs: new Map<string, string[]>(),
    },
    devWorkspaces: {
      isLoading: false,
      workspaces: [],
      workspacesLogs: new Map<string, string[]>(),
    },
    workspacesSettings: {
      isLoading: false,
      settings: {} as che.WorkspaceSettings,
    },
    branding: {
      isLoading: false,
      data: {},
    } as BrandingState,
    devfileRegistries: {
      isLoading: false,
      devfiles: {},
      filter: '',
      registries: {},
      schema: {},
    } as DevfileRegistriesState,
    user: {
      isLoading: false,
      user: {},
    } as UserState,
    userProfile: {
      isLoading: false,
      profile: {},
    } as UserProfileState,
    infrastructureNamespaces: {
      isLoading: false,
      namespaces: [],
    } as InfrastructureNamespaceState,
    userPreferences: {
      isLoading: false,
      preferences: {}
    },
    dwPlugins: {
      isLoading: false,
      plugins: {},
    },
  };

  public withBannerAlert(messages: string[]): FakeStoreBuilder {
    this.state.bannerAlert.messages = [...messages];
    return this;
  }

  public withUserPreferences(registries: RegistryRow[], isLoading = false): FakeStoreBuilder {
    const newContainerCredentials: ContainerCredentials = {};
    registries.forEach(item => {
      const { url, username, password } = item;
      newContainerCredentials[url] = { username, password };
    });
    this.state.userPreferences.preferences = { dockerCredentials: btoa(JSON.stringify(newContainerCredentials)) };
    this.state.branding.isLoading = isLoading;
    return this;
  }

  public withBranding(branding: BrandingData, isLoading = false, error?: string): FakeStoreBuilder {
    this.state.branding.data = Object.assign({}, branding);
    this.state.branding.isLoading = isLoading;
    this.state.branding.error = error;
    return this;
  }

  public withFactoryResolver(resolver: FactoryResolver, isLoading = false): FakeStoreBuilder {
    this.state.factoryResolver.resolver = Object.assign({}, resolver);
    this.state.factoryResolver.isLoading = isLoading;
    return this;
  }

  public withInfrastructureNamespace(namespaces: che.KubernetesNamespace[], isLoading = false, error?: string): FakeStoreBuilder {
    this.state.infrastructureNamespaces.namespaces = Object.assign([], namespaces);
    this.state.infrastructureNamespaces.isLoading = isLoading;
    this.state.infrastructureNamespaces.error = error;
    return this;
  }

  public withPlugins(plugins: che.Plugin[], isLoading = false, error?: string): FakeStoreBuilder {
    this.state.plugins.plugins = Object.assign([], plugins);
    this.state.plugins.isLoading = isLoading;
    this.state.plugins.error = error;
    return this;
  }

  public withUser(user: che.User, error?: string): FakeStoreBuilder {
    this.state.user.user = Object.assign({}, user);
    this.state.user.error = error;
    return this;
  }

  public withUserProfile(profile: api.che.user.Profile, error?: string): FakeStoreBuilder {
    this.state.userProfile.profile = Object.assign({}, profile);
    this.state.userProfile.error = error;
    return this;
  }

  public withDevfileRegistries(
    options: {
      devfiles?: { [location: string]: { content: string, error: string } },
      registries?: { [location: string]: { metadata?: che.DevfileMetaData[], error?: string } },
      schema?: any,
    }, isLoading = false,
  ): FakeStoreBuilder {
    if (options.devfiles) {
      this.state.devfileRegistries.devfiles = Object.assign({}, options.devfiles);
    }
    if (options.registries) {
      this.state.devfileRegistries.registries = Object.assign({}, options.registries);
    }
    if (options.schema) {
      this.state.devfileRegistries.schema = Object.assign({}, options.schema);
    }
    this.state.devfileRegistries.isLoading = isLoading;
    return this;
  }

  public withWorkspacesSettings(
    settings: che.WorkspaceSettings,
    isLoading = false,
    error?: string,
  ): FakeStoreBuilder {
    this.state.workspacesSettings.settings = Object.assign({}, settings);
    this.state.workspacesSettings.isLoading = isLoading;
    this.state.workspacesSettings.error = error;
    return this;
  }

  public withCheWorkspaces(
    options: {
      workspaces?: che.Workspace[],
      workspacesLogs?: Map<string, string[]>,
    },
    isLoading = false,
    error?: string,
  ): FakeStoreBuilder {
    if (options.workspaces) {
      this.state.cheWorkspaces.workspaces = Object.assign([], options.workspaces);
    }
    if (options.workspacesLogs) {
      this.state.cheWorkspaces.workspacesLogs = new Map(options.workspacesLogs);
    }
    this.state.cheWorkspaces.isLoading = isLoading;
    this.state.cheWorkspaces.error = error;
    return this;
  }

  public withDevWorkspaces(
    options: {
      workspaces?: IDevWorkspace[],
      workspacesLogs?: Map<string, string[]>,
    },
    isLoading = false,
    error?: string,
  ): FakeStoreBuilder {
    if (options.workspaces) {
      this.state.devWorkspaces.workspaces = Object.assign([], options.workspaces);
    }
    if (options.workspacesLogs) {
      this.state.devWorkspaces.workspacesLogs = new Map(options.workspacesLogs);
    }
    this.state.devWorkspaces.isLoading = isLoading;
    this.state.devWorkspaces.error = error;
    return this;
  }

  public withWorkspaces(
    options: {
      namespace?: string,
      workspaceName?: string,
      workspaceId?: string,
      recentNumber?: number
    },
    isLoading = false
  ): FakeStoreBuilder {
    if (options.namespace) {
      this.state.workspaces.namespace = options.namespace;
    }
    if (options.workspaceName) {
      this.state.workspaces.workspaceName = options.workspaceName;
    }
    if (options.workspaceId) {
      this.state.workspaces.workspaceId = options.workspaceId;
    }
    if (options.recentNumber) {
      this.state.workspaces.recentNumber = options.recentNumber;
    }
    this.state.workspaces.isLoading = isLoading;
    return this;
  }

  public withDwPlugins(
    plugins: { [location: string]: { plugin?: IDevWorkspaceDevfile, error?: string } },
    isLoading = false,
    defaultEditorError?: string,
  ) {
    this.state.dwPlugins.defaultEditorError = defaultEditorError;
    this.state.dwPlugins.plugins = Object.assign({}, plugins);
    this.state.dwPlugins.isLoading = isLoading;

    return this;
  }

  public build(): Store {
    const middlewares = [mockThunk];
    const mockStore = createMockStore(middlewares);
    return mockStore(this.state);
  }

}
