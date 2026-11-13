// Registra os tipos dos matchers do jest-dom (toBeInTheDocument, toHaveAttribute...)
// para o TypeScript. O jest.setup.js carrega os matchers em tempo de execução,
// mas por ser .js não é incluído na checagem de tipos do build.
import "@testing-library/jest-dom";
