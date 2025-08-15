// hooks/useTeams.ts
import useSWR, { mutate } from 'swr';
import { useCallback } from 'react';

// Types
interface Team {
  $id: string;
  name: string;
  total: number;
  $createdAt: string;
  $updatedAt: string;
}

interface Member {
  $id: string;
  userId: string;
  teamId: string;
  roles: string[];
  invited: string;
  joined: string;
  confirm: boolean;
  userName: string;
  userEmail: string;
}

interface TeamsResponse {
  teams: Team[];
  total: number;
}

interface MembersResponse {
  memberships: Member[];
  total: number;
}

interface TeamsParams {
  limit?: number;
  page?: number;
  query?: string;
}

interface MembersParams {
  limit?: number;
  page?: number;
}

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

// API functions
const teamsApi = {
  getTeams: async (params?: TeamsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.query) searchParams.append('query', params.query);

    const response = await fetch(`/api/teams?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  createTeam: async (teamName: string) => {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName }),
    });
    if (!response.ok) throw new Error('Failed to create team');
    return response.json();
  },

  getTeamMembers: async (teamId: string, params?: MembersParams) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());

    const response = await fetch(`/api/teams/${teamId}/members?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  },

  addTeamMember: async (teamId: string, email: string, roles: string[] = []) => {
    const response = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, roles }),
    });
    if (!response.ok) throw new Error('Failed to add team member');
    return response.json();
  },

  deleteTeamMember: async (teamId: string, membershipId: string) => {
    const response = await fetch(`/api/teams/${teamId}/members/${membershipId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete team member');
    return response.json();
  },
};

// Generate cache keys
const getCacheKey = {
  teams: (params?: TeamsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.query) searchParams.append('query', params.query);
    return `/api/teams?${searchParams}`;
  },
  teamMembers: (teamId: string, params?: MembersParams) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    return `/api/teams/${teamId}/members?${searchParams}`;
  },
};

// Main useTeams hook
export const useTeams = (params?: TeamsParams) => {
  const cacheKey = getCacheKey.teams(params);
  const { data, error, isLoading, isValidating } = useSWR<TeamsResponse>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Create team with optimistic updates
  const createTeam = useCallback(async (teamName: string) => {
    try {
      // Optimistic update
      const optimisticTeam: Team = {
        $id: `temp-${Date.now()}`,
        name: teamName,
        total: 0,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };

      await mutate(
        cacheKey,
        async (currentData: TeamsResponse | undefined) => {
          const result = await teamsApi.createTeam(teamName);
          
          if (result.success) {
            return {
              teams: [...(currentData?.teams || []), result.team],
              total: (currentData?.total || 0) + 1,
            };
          }
          throw new Error(result.error || 'Failed to create team');
        },
        {
          optimisticData: data ? {
            teams: [...data.teams, optimisticTeam],
            total: data.total + 1,
          } : undefined,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      // Invalidate all teams cache
      mutate((key) => typeof key === 'string' && key.startsWith('/api/teams'));
      
      return { success: true };
    } catch (error) {
      console.error('Create team error:', error);
      return { success: false, error: (error as Error).message };
    }
  }, [cacheKey, data]);

  // Refresh teams
  const refreshTeams = useCallback(() => {
    mutate(cacheKey);
  }, [cacheKey]);

  // Invalidate all teams cache
  const invalidateTeams = useCallback(() => {
    mutate((key) => typeof key === 'string' && key.startsWith('/api/teams'));
  }, []);

  return {
    teams: data?.teams || [],
    total: data?.total || 0,
    isLoading,
    isValidating,
    error,
    createTeam,
    refreshTeams,
    invalidateTeams,
  };
};

// Hook for team members
export const useTeamMembers = (teamId: string, params?: MembersParams) => {
  const cacheKey = getCacheKey.teamMembers(teamId, params);
  const { data, error, isLoading, isValidating } = useSWR<MembersResponse>(
    teamId ? cacheKey : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Add member with optimistic updates
  const addMember = useCallback(async (email: string, roles: string[] = []) => {
    if (!teamId) return { success: false, error: 'Team ID required' };

    try {
      await mutate(
        cacheKey,
        async (currentData: MembersResponse | undefined) => {
          const result = await teamsApi.addTeamMember(teamId, email, roles);
          
          if (result.success) {
            return {
              memberships: [...(currentData?.memberships || []), result.result],
              total: (currentData?.total || 0) + 1,
            };
          }
          throw new Error(result.error || 'Failed to add member');
        },
        {
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      // Invalidate all related caches
      mutate((key) => typeof key === 'string' && key.includes(`/teams/${teamId}/members`));
      
      return { success: true };
    } catch (error) {
      console.error('Add member error:', error);
      return { success: false, error: (error as Error).message };
    }
  }, [teamId, cacheKey]);

  // Delete member with optimistic updates
  const deleteMember = useCallback(async (membershipId: string) => {
    if (!teamId) return { success: false, error: 'Team ID required' };

    try {
      await mutate(
        cacheKey,
        async (currentData: MembersResponse | undefined) => {
          const result = await teamsApi.deleteTeamMember(teamId, membershipId);
          
          if (result.success) {
            return {
              memberships: (currentData?.memberships || []).filter(
                member => member.$id !== membershipId
              ),
              total: Math.max((currentData?.total || 1) - 1, 0),
            };
          }
          throw new Error(result.error || 'Failed to delete member');
        },
        {
          optimisticData: data ? {
            memberships: data.memberships.filter(member => member.$id !== membershipId),
            total: Math.max(data.total - 1, 0),
          } : undefined,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      // Invalidate all related caches
      mutate((key) => typeof key === 'string' && key.includes(`/teams/${teamId}/members`));
      
      return { success: true };
    } catch (error) {
      console.error('Delete member error:', error);
      return { success: false, error: (error as Error).message };
    }
  }, [teamId, cacheKey, data]);

  // Refresh members
  const refreshMembers = useCallback(() => {
    mutate(cacheKey);
  }, [cacheKey]);

  return {
    members: data?.memberships || [],
    total: data?.total || 0,
    isLoading,
    isValidating,
    error,
    addMember,
    deleteMember,
    refreshMembers,
  };
};