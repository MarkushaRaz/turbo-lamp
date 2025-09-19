import log from 'electron-log';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { IS_LINUX, IS_DARWIN } from '_shared/constants';
import { asError } from '_shared/utils';

const logger = log.scope('PulseAudioInstaller');
const execAsync = promisify(exec);

export class PulseAudioInstaller {
  private static isInstalling = false;

  public static async checkAndInstallPulseAudio(): Promise<boolean> {
    if (PulseAudioInstaller.isInstalling) {
      logger.info('PulseAudio installation already in progress');
      return false;
    }

    try {
      const isInstalled = await PulseAudioInstaller.checkPulseAudioInstalled();
      
      if (isInstalled) {
        logger.info('PulseAudio is already installed');
        return true;
      }

      logger.info('PulseAudio not found, attempting automatic installation');
      return await PulseAudioInstaller.installPulseAudio();
    } catch (error) {
      logger.error('Failed to check or install PulseAudio', asError(error));
      return false;
    }
  }

  public static async checkPulseAudioAvailability(): Promise<{
    isInstalled: boolean;
    isRunning: boolean;
    canInstall: boolean;
  }> {
    const result = {
      isInstalled: false,
      isRunning: false,
      canInstall: IS_LINUX || IS_DARWIN,
    };

    if (!result.canInstall) {
      return result;
    }

    try {
      // Проверяем установку
      await execAsync('which pactl');
      result.isInstalled = true;

      // Проверяем запуск
      const { stdout } = await execAsync('pactl info 2>/dev/null || echo "not_running"');
      result.isRunning = !stdout.includes('not_running');

    } catch (error) {
      logger.debug('PulseAudio availability check failed', asError(error));
    }

    return result;
  }

  private static async checkPulseAudioInstalled(): Promise<boolean> {
    logger.debug('Checking if PulseAudio is installed');
    
    try {
      // Проверяем наличие pactl команды
      await execAsync('which pactl');
      
      // Проверяем, что PulseAudio сервер запущен или может быть запущен
      const { stdout } = await execAsync('pactl info 2>/dev/null || echo "not_running"');
      
      if (stdout.includes('not_running')) {
        // Пытаемся запустить PulseAudio
        try {
          await execAsync('pulseaudio --start --log-target=null 2>/dev/null');
          logger.info('PulseAudio server started');
        } catch (startError) {
          logger.warn('Could not start PulseAudio server', asError(startError));
        }
      }
      
      return true;
    } catch (error) {
      logger.debug('PulseAudio not found or not working', asError(error));
      return false;
    }
  }

  private static async installPulseAudio(): Promise<boolean> {
    PulseAudioInstaller.isInstalling = true;
    
    try {
      if (IS_LINUX) {
        return await PulseAudioInstaller.installOnLinux();
      } else if (IS_DARWIN) {
        return await PulseAudioInstaller.installOnMacOS();
      } else {
        logger.warn('PulseAudio installation not supported on this platform');
        return false;
      }
    } finally {
      PulseAudioInstaller.isInstalling = false;
    }
  }

  private static async installOnLinux(): Promise<boolean> {
    logger.info('Installing PulseAudio on Linux');
    
    try {
      // Определяем дистрибутив Linux
      const { stdout: osRelease } = await execAsync('cat /etc/os-release 2>/dev/null || echo ""');
      
      let installCommand = '';
      
      if (osRelease.includes('ubuntu') || osRelease.includes('debian')) {
        // Ubuntu/Debian
        installCommand = 'apt-get update && apt-get install -y pulseaudio pulseaudio-utils';
      } else if (osRelease.includes('fedora') || osRelease.includes('rhel') || osRelease.includes('centos')) {
        // Fedora/RHEL/CentOS
        installCommand = 'dnf install -y pulseaudio pulseaudio-utils || yum install -y pulseaudio pulseaudio-utils';
      } else if (osRelease.includes('arch')) {
        // Arch Linux
        installCommand = 'pacman -S --noconfirm pulseaudio pulseaudio-alsa';
      } else if (osRelease.includes('opensuse')) {
        // openSUSE
        installCommand = 'zypper install -y pulseaudio pulseaudio-utils';
      } else {
        // Попытка универсальной установки
        logger.warn('Unknown Linux distribution, trying common package managers');
        const managers = [
          'apt-get update && apt-get install -y pulseaudio pulseaudio-utils',
          'dnf install -y pulseaudio pulseaudio-utils',
          'yum install -y pulseaudio pulseaudio-utils',
          'pacman -S --noconfirm pulseaudio pulseaudio-alsa',
          'zypper install -y pulseaudio pulseaudio-utils'
        ];
        
        for (const cmd of managers) {
          try {
            await PulseAudioInstaller.executeInstallCommand(cmd);
            logger.info('PulseAudio installed successfully');
            return await PulseAudioInstaller.startPulseAudioService();
          } catch (error) {
            logger.debug(`Failed with command: ${cmd}`, asError(error));
            continue;
          }
        }
        
        logger.error('Could not install PulseAudio with any known package manager');
        return false;
      }
      
      await PulseAudioInstaller.executeInstallCommand(installCommand);
      logger.info('PulseAudio installed successfully on Linux');
      return await PulseAudioInstaller.startPulseAudioService();
      
    } catch (error) {
      logger.error('Failed to install PulseAudio on Linux', asError(error));
      return false;
    }
  }

  private static async installOnMacOS(): Promise<boolean> {
    logger.info('Installing PulseAudio on macOS');
    
    try {
      // Проверяем наличие Homebrew
      try {
        await execAsync('which brew');
      } catch (error) {
        logger.error('Homebrew not found. PulseAudio installation requires Homebrew on macOS');
        return false;
      }
      
      // Устанавливаем PulseAudio через Homebrew
      await PulseAudioInstaller.executeInstallCommand('brew install pulseaudio');
      logger.info('PulseAudio installed successfully on macOS');
      
      return await PulseAudioInstaller.startPulseAudioService();
      
    } catch (error) {
      logger.error('Failed to install PulseAudio on macOS', asError(error));
      return false;
    }
  }

  private static executeInstallCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.debug(`Executing install command: ${command}`);
      
      const process = spawn('sh', ['-c', command], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          logger.debug('Install command completed successfully');
          resolve();
        } else {
          logger.error(`Install command failed with code ${code}. Stderr: ${stderr}`);
          reject(new Error(`Installation failed with exit code ${code}: ${stderr}`));
        }
      });
      
      process.on('error', (error) => {
        logger.error('Install command process error', asError(error));
        reject(error);
      });
      
      // Таймаут для установки (10 минут)
      setTimeout(() => {
        if (!process.killed) {
          process.kill('SIGTERM');
          reject(new Error('Installation timeout'));
        }
      }, 600000);
    });
  }

  private static async startPulseAudioService(): Promise<boolean> {
    try {
      logger.info('Starting PulseAudio service');
      
      // Запускаем PulseAudio в пользовательском режиме
      await execAsync('pulseaudio --start --log-target=null 2>/dev/null || true');
      
      // Проверяем, что сервис запустился
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { stdout } = await execAsync('pactl info 2>/dev/null || echo "failed"');
      
      if (stdout.includes('failed')) {
        logger.warn('PulseAudio service failed to start properly');
        return false;
      }
      
      logger.info('PulseAudio service started successfully');
      return true;
      
    } catch (error) {
      logger.error('Failed to start PulseAudio service', asError(error));
      return false;
    }
  }

  public static async ensurePulseAudioRunning(): Promise<boolean> {
    try {
      // Проверяем, что PulseAudio запущен
      const { stdout } = await execAsync('pactl info 2>/dev/null || echo "not_running"');
      
      if (stdout.includes('not_running')) {
        logger.info('PulseAudio not running, attempting to start');
        return await PulseAudioInstaller.startPulseAudioService();
      }
      
      return true;
    } catch (error) {
      logger.error('Failed to ensure PulseAudio is running', asError(error));
      return false;
    }
  }
}