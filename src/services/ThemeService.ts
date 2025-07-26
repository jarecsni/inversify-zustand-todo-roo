import { injectable, inject } from "inversify";
import type { Theme, IThemeService, ILoggingService } from "@/types";
import { TYPES } from "@/container/types";
import { MasterStore, StoreView } from "@/store/MasterStore";

const DEFAULT_THEME: Theme = {
  name: "light",
  primaryColor: "#007bff",
  backgroundColor: "#ffffff",
  textColor: "#333333",
};

@injectable()
export class ThemeService implements IThemeService {
  private themeStore: StoreView<Theme>;

  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.MasterStore) masterStore: MasterStore
  ) {
    this.themeStore = masterStore.getStore<Theme>('theme', DEFAULT_THEME);
  }

  getTheme(): Theme {
    return this.themeStore.get();
  }

  setTheme(theme: Theme): void {
    this.themeStore.set(theme);
    this.loggingService.info("Theme changed", {
      name: theme.name,
      primaryColor: theme.primaryColor,
    });
  }

  subscribe(callback: (theme: Theme) => void): () => void {
    return this.themeStore.subscribe(callback);
  }
}
