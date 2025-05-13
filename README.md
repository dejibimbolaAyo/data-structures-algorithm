# Data Structures & Algorithms Visualizer

**An interactive learning platform for data structures and algorithms.**  
Features live code execution, animated visualizations, running time graphs, and MDX-powered explanations.

---

## Features

- 📚 **MDX-based content** for explanations and problems
- 🧑‍💻 **Live code editor and executor** (TypeScript, with multi-language support planned)
- 🧩 **Animated visualizers** for array operations (insert, delete, search, access)
- 📈 **Performance graphs** using real measured times (`performance.now()`)
- 🏷️ **Running time tables** and theoretical vs. empirical comparison
- 🌗 **Dark/light theme** with Tailwind and theme switcher
- 🖱️ **Drag-to-scroll** for large visualizations
- ♿ **Accessible** and keyboard-friendly UI

---

## Getting Started

### 1. **Install dependencies**

```sh
npm install
# or
yarn install
```

### 2. **Run the development server**

```sh
npm run dev
# or
yarn dev
```

### 3. **Open the app**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
  components/
    RunningTimeTable.tsx
    RunningTimeGraph.tsx
    visualizers/
      ArrayVisualizer.tsx
      InteractiveRunningTimeGraph.tsx
    ...
  content/
    data/
      arrayRunningTimes.ts
    ...
  routes/
    ...
  utils/
    generateGrowthData.ts
  ...
public/
  author.jpg
  ...
tailwind.config.ts
```

---

## MDX Content

- Write your explanations and problems in `.mdx` files in `app/content/`.
- You can import data, components, and utilities directly into MDX.
- Example:

  ```mdx
  import { RunningTimeTable } from "@/components/RunningTimeTable";
  import { arrayRunningTimes } from "@/content/data/arrayRunningTimes";

  <RunningTimeTable times={arrayRunningTimes} />
  ```

---

## Visualizers

- **ArrayVisualizer**: Animates array operations and plots real running time as input size changes.
- **InteractiveRunningTimeGraph**: Lets you select which operation's performance graph to view.

---

## Performance Graphs

- Uses `performance.now()` to measure and plot actual operation times.
- Note: These are for visualization only and may vary by device/browser.

---

## Theming

- Uses Tailwind CSS with `darkMode: "class"`.
- Theme switcher is available; all components use `dark:` classes for styling.

---

## Accessibility

- All interactive elements are accessible via keyboard and screen readers.
- Drag-to-scroll areas use appropriate ARIA roles and labels.

---

## Development Notes

- **Import order** is enforced via `eslint-plugin-import`.
- **TypeScript** is used throughout.
- **Recharts** is used for plotting graphs.
- **MDX** supports imports of data and components.
- **Performance data** is kept for each operation and input size, and is not reset when switching operations.

---

## Authors

- ![Author](./public/author.jpg)  
  **Your Name**  
  [your.email@example.com](mailto:your.email@example.com)

---

## Contributing

Pull requests and issues are welcome!  
Please open an issue to discuss major changes.

---

## License

MIT
