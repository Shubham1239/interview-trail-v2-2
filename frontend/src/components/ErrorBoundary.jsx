import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  handleRetry() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="mx-auto max-w-md py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold">Something broke on this page</h2>
            <p className="mb-4 text-ink-500">Try reloading — if it keeps happening, the details are in the console.</p>
            <button
              onClick={this.handleRetry}
              className="rounded-md bg-ink-900 px-4 py-2 text-sm text-paper"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
