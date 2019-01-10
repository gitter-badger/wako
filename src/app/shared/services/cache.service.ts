import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

export class CacheService {
  public static storageEngine = new Storage({
    name: 'wako_cache'
  });

  private static serialize(data: any, expiresAt: number) {
    const d: CacheSerialized = {
      data: data,
      expiresAt: expiresAt
    };

    return JSON.stringify(d);
  }

  private static unSerialize(string: string) {
    try {
      return JSON.parse(string) as CacheSerialized;
    } catch (e) {
      return null;
    }
  }

  private static hasExpired(data: CacheSerialized) {
    return data.expiresAt < Date.now();
  }

  static get<T>(key: string) {
    return from(this.storageEngine.get(key)).pipe(
      map(data => {
        const cache = this.unSerialize(data);

        if (!cache) {
          return null;
        }

        if (this.hasExpired(cache)) {
          console.log('key', key, 'has expired');
          this.remove(key);
          return null;
        }

        return cache.data as T;
      })
    );
  }

  /**
   *
   * @param key
   * @param data
   * @param expiresAt ie 1h, 1d, 1m. h = hour, d = day, m = month or time
   */
  static set(key: string, data: any, expiresAt: string | number) {
    const date = new Date();

    if (typeof expiresAt === 'number') {
      date.setTime(date.getTime() + expiresAt);
    } else if (typeof expiresAt === 'string') {
      if (expiresAt.match('h')) {
        date.setHours(date.getHours() + parseFloat(expiresAt));
      } else if (expiresAt.match('d')) {
        date.setDate(date.getDate() + parseFloat(expiresAt));
      } else if (expiresAt.match('m')) {
        date.setMonth(date.getMonth() + parseFloat(expiresAt));
      }
    }

    return this.storageEngine.set(key, this.serialize(data, date.getTime())).catch(err => {
      console.log({ err });
    });
  }

  static remove(key: string) {
    return this.storageEngine.remove(key);
  }

  static clear() {
    return this.storageEngine.clear();
  }

  static prune() {
    console.log('cache prune');
    this.storageEngine.keys().then(keys => {
      keys.forEach(key => {
        this.get(key).subscribe(data => {
          // Do nothing
        });
      });
    });
  }
}

interface CacheSerialized {
  data: any;
  expiresAt: number;
}
