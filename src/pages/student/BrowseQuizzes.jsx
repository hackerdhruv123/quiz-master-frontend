import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import QuizCard from '../../components/quiz/QuizCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { FiBookOpen } from 'react-icons/fi';

export default function BrowseQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');

  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/quizzes?${params.toString()}`);
      if (res.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [search, category, difficulty, sort]);

  const handleStartQuiz = (quiz) => {
    navigate(`/student/quiz/${quiz.id}`);
  };

  const categories = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'Security', value: 'Security' },
  ];

  const difficulties = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Duration: Short to Long', value: 'duration_asc' },
    { label: 'Duration: Long to Short', value: 'duration_desc' },
    { label: 'Title: A-Z', value: 'title_asc' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
          <FiBookOpen className="text-blue-500" /> Browse Assessment Quizzes
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Select a quiz to test your technical proficiency. All quizzes are timed and scored automatically.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search quizzes by title or topic..." />

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown value={category} onChange={setCategory} options={categories} label="Category" />
          <FilterDropdown value={difficulty} onChange={setDifficulty} options={difficulties} label="Difficulty" />
          <FilterDropdown value={sort} onChange={setSort} options={sortOptions} label="Sort" />
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching available quizzes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchQuizzes} />
      ) : quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes found"
          message="No published quizzes match your search criteria. Try clearing search filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('');
            setDifficulty('');
            setSort('newest');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
          ))}
        </div>
      )}
    </div>
  );
}
