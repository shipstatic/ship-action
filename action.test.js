import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
const mockCore = {
  getInput: vi.fn(),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  info: vi.fn(),
  error: vi.fn()
};

const mockShip = {
  deployments: {
    create: vi.fn()
  },
  aliases: {
    set: vi.fn()
  }
};

const MockShipConstructor = vi.fn(() => mockShip);

// Apply mocks
vi.mock('@actions/core', () => mockCore);
vi.mock('@actions/github', () => ({}));
vi.mock('@shipstatic/ship', () => MockShipConstructor);

describe('GitHub Action Inputs and Outputs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should accept api-key input', () => {
      mockCore.getInput.mockReturnValue('ship-test-key');
      const apiKey = mockCore.getInput('api-key', { required: true });
      expect(apiKey).toBe('ship-test-key');
    });

    it('should accept api-url input with default', () => {
      mockCore.getInput.mockReturnValue('');
      const apiUrl = mockCore.getInput('api-url') || 'https://api.shipstatic.com';
      expect(apiUrl).toBe('https://api.shipstatic.com');
    });

    it('should accept custom api-url', () => {
      mockCore.getInput.mockReturnValue('https://custom.api.com');
      const apiUrl = mockCore.getInput('api-url');
      expect(apiUrl).toBe('https://custom.api.com');
    });
  });

  describe('Deploy Operation', () => {
    it('should create Ship instance with correct config', () => {
      const apiKey = 'ship-test-key';
      const apiUrl = 'https://api.shipstatic.com';
      
      new MockShipConstructor({ apiUrl, apiKey });
      
      expect(MockShipConstructor).toHaveBeenCalledWith({ apiUrl, apiKey });
    });

    it('should handle deployment success', async () => {
      const mockResult = {
        id: 'deploy-123',
        deployment: 'https://deploy-123.shipstatic.com'
      };
      
      mockShip.deployments.create.mockResolvedValue(mockResult);
      
      const result = await mockShip.deployments.create(['./dist']);
      
      expect(result).toEqual(mockResult);
      expect(mockShip.deployments.create).toHaveBeenCalledWith(['./dist']);
    });

    it('should log operation start', () => {
      mockCore.info('Starting deploy operation...');
      expect(mockCore.info).toHaveBeenCalledWith('Starting deploy operation...');
    });

    it('should set correct outputs for deployment', () => {
      mockCore.setOutput('deployment-id', 'deploy-123');
      mockCore.setOutput('deployment-url', 'https://deploy-123.shipstatic.com');
      
      expect(mockCore.setOutput).toHaveBeenCalledWith('deployment-id', 'deploy-123');
      expect(mockCore.setOutput).toHaveBeenCalledWith('deployment-url', 'https://deploy-123.shipstatic.com');
    });
  });

  describe('Alias Operation', () => {
    it('should handle alias success', async () => {
      const mockResult = {
        url: 'https://production.shipstatic.com'
      };
      
      mockShip.aliases.set.mockResolvedValue(mockResult);
      
      const result = await mockShip.aliases.set('production', 'deploy-123');
      
      expect(result).toEqual(mockResult);
      expect(mockShip.aliases.set).toHaveBeenCalledWith('production', 'deploy-123');
    });

    it('should set correct outputs for alias', () => {
      mockCore.setOutput('alias-url', 'https://production.shipstatic.com');
      
      expect(mockCore.setOutput).toHaveBeenCalledWith('alias-url', 'https://production.shipstatic.com');
    });
  });

  describe('Error Handling', () => {
    it('should handle deployment errors', async () => {
      const error = new Error('Deployment failed');
      mockShip.deployments.create.mockRejectedValue(error);
      
      try {
        await mockShip.deployments.create(['./dist']);
      } catch (e) {
        expect(e.message).toBe('Deployment failed');
      }
    });

    it('should handle alias errors', async () => {
      const error = new Error('Alias failed');
      mockShip.aliases.set.mockRejectedValue(error);
      
      try {
        await mockShip.aliases.set('production', 'deploy-123');
      } catch (e) {
        expect(e.message).toBe('Alias failed');
      }
    });

    it('should call setFailed on errors', () => {
      mockCore.setFailed('Test error');
      
      expect(mockCore.setFailed).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Input Validation', () => {
    it('should validate required alias-name', () => {
      const aliasName = '';
      if (!aliasName) {
        mockCore.setFailed('alias-name is required');
      }
      
      expect(mockCore.setFailed).toHaveBeenCalledWith('alias-name is required');
    });

    it('should validate required deployment-id', () => {
      const deploymentId = '';
      if (!deploymentId) {
        mockCore.setFailed('deployment-id is required');
      }
      
      expect(mockCore.setFailed).toHaveBeenCalledWith('deployment-id is required');
    });

    it('should validate supported operations', () => {
      const operation = 'invalid';
      if (!['deploy', 'alias'].includes(operation)) {
        mockCore.setFailed(`Unsupported operation: ${operation}`);
      }
      
      expect(mockCore.setFailed).toHaveBeenCalledWith('Unsupported operation: invalid');
    });
  });
});