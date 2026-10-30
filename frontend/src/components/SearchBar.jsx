import { useRecoilState } from 'recoil';
import { feedFiltersAtom } from '../atoms/filters';
import Input from './ui/Input';
import Badge from './ui/Badge';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'top', label: 'Top' },
];

export default function SearchBar() {
  const [filters, setFilters] = useRecoilState(feedFiltersAtom);

  function handleSearchChange(e) {
    const value = e.target.value;
    setFilters(function updateSearch(f) {
      return { ...f, searchTerm: value };
    });
  }

  function handleSortSelect(value) {
    return function onSelect() {
      setFilters(function updateSort(f) {
        return { ...f, sortBy: value };
      });
    };
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          id="feed-search"
          placeholder="Search experiences, companies, roles…"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex gap-2">
        {SORT_OPTIONS.map(function renderOption(opt) {
          return (
            <button key={opt.value} onClick={handleSortSelect(opt.value)}>
              <Badge tone={filters.sortBy === opt.value ? 'accent' : 'neutral'}>{opt.label}</Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
