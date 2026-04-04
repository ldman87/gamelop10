export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Question {
  id: number;
  type: QuestionType;
  topic: string;
  content: string;
  options?: string[]; // For multiple-choice
  statements?: string[]; // For true-false
  correctAnswer: any; // string for mc/sa, boolean[] for tf
  explanation: string;
  image?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    topic: 'Mệnh đề',
    content: 'Trong các câu sau, câu nào là mệnh đề?',
    options: [
      'Hôm nay trời đẹp quá!',
      'Bạn có thích học Toán không?',
      'Số 15 là số nguyên tố.',
      'Hãy làm bài tập đi!'
    ],
    correctAnswer: 'Số 15 là số nguyên tố.',
    explanation: 'Mệnh đề là một câu khẳng định có tính đúng hoặc sai rõ ràng. "Số 15 là số nguyên tố" là một khẳng định (sai), nên nó là mệnh đề.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    topic: 'Mệnh đề',
    content: 'Mệnh đề phủ định của mệnh đề $P: "\\forall x \\in \\mathbb{R}, x^2 + 1 > 0"$ là:',
    options: [
      '$\\overline{P}: "\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0"$',
      '$\\overline{P}: "\\forall x \\in \\mathbb{R}, x^2 + 1 \\le 0"$',
      '$\\overline{P}: "\\exists x \\in \\mathbb{R}, x^2 + 1 < 0"$',
      '$\\overline{P}: "\\forall x \\in \\mathbb{R}, x^2 + 1 < 0"$'
    ],
    correctAnswer: '$\\overline{P}: "\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0"$',
    explanation: 'Phủ định của $\\forall$ là $\\exists$, phủ định của $>$ là $\\le$.'
  },
  {
    id: 3,
    type: 'true-false',
    topic: 'Tập hợp',
    content: 'Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid x < 5\\}$. Xét tính đúng sai của các khẳng định sau:',
    statements: [
      '$0 \\in A$',
      '$5 \\in A$',
      '$A = \\{1, 2, 3, 4\\}$',
      '$A$ có 5 phần tử'
    ],
    correctAnswer: [true, false, false, true],
    explanation: '$A = \\{0, 1, 2, 3, 4\\}$. Vậy $0 \\in A$ đúng, $5 \\in A$ sai, $A=\\{1,2,3,4\\}$ sai (thiếu 0), $A$ có 5 phần tử là đúng.'
  },
  {
    id: 4,
    type: 'short-answer',
    topic: 'Các phép toán tập hợp',
    content: 'Cho $A = \\{1, 2, 3, 4, 5\\}$ và $B = \\{3, 4, 5, 6, 7\\}$. Tìm số phần tử của tập hợp $A \\cap B$.',
    correctAnswer: '3',
    explanation: '$A \\cap B = \\{3, 4, 5\\}$, nên số phần tử là 3.'
  },
  {
    id: 5,
    type: 'multiple-choice',
    topic: 'Tập hợp',
    content: 'Cho tập hợp $X = \\{x \\in \\mathbb{R} \\mid (x^2 - 1)(x^2 - 3x + 2) = 0\\}$. Tập hợp $X$ được viết dưới dạng liệt kê là:',
    options: [
      '$X = \\{-1, 1, 2\\}$',
      '$X = \\{1, 2\\}$',
      '$X = \\{-1, 1\\}$',
      '$X = \\{-1, 2\\}$'
    ],
    correctAnswer: '$X = \\{-1, 1, 2\\}$',
    explanation: '$(x^2-1)=0 \\Leftrightarrow x = \\pm 1$. $(x^2-3x+2)=0 \\Leftrightarrow x=1$ hoặc $x=2$. Hợp các nghiệm lại ta được $\\{-1, 1, 2\\}$.'
  },
  {
    id: 6,
    type: 'true-false',
    topic: 'Mệnh đề kéo theo',
    content: 'Cho mệnh đề $P \\Rightarrow Q$: "Nếu tam giác $ABC$ cân thì tam giác $ABC$ đều". Khẳng định nào sau đây đúng?',
    statements: [
      'Mệnh đề trên là mệnh đề đúng',
      'Mệnh đề đảo $Q \\Rightarrow P$ là mệnh đề đúng',
      '$P$ là điều kiện đủ để có $Q$',
      '$Q$ là điều kiện đủ để có $P$'
    ],
    correctAnswer: [false, true, false, true],
    explanation: 'Tam giác cân chưa chắc đều (sai). Tam giác đều thì chắc chắn cân (đúng). $P \\Rightarrow Q$ sai nên $P$ không là điều kiện đủ. $Q \\Rightarrow P$ đúng nên $Q$ là điều kiện đủ cho $P$.'
  },
  {
    id: 7,
    type: 'short-answer',
    topic: 'Tập hợp',
    content: 'Cho tập hợp $A = [1; 5]$ và $B = (2; 7)$. Tìm tập hợp $A \\cup B$ dưới dạng khoảng/đoạn. (Ví dụ: [a; b] hoặc (a; b))',
    correctAnswer: '[1; 7)',
    explanation: 'Hợp của $[1; 5]$ và $(2; 7)$ là $[1; 7)$.'
  },
  {
    id: 8,
    type: 'multiple-choice',
    topic: 'Các phép toán tập hợp',
    content: 'Cho $A = \\{x \\in \\mathbb{R} \\mid |x| < 3\\}$ và $B = \\{x \\in \\mathbb{R} \\mid x \\ge 1\\}$. Khi đó $A \\backslash B$ là:',
    options: [
      '$(-3; 1)$',
      '$[-3; 1)$',
      '$(-3; 1]$',
      '$(1; 3)$'
    ],
    correctAnswer: '$(-3; 1)$',
    explanation: '$A = (-3; 3)$, $B = [1; +\\infty)$. $A \\backslash B = (-3; 3) \\backslash [1; +\\infty) = (-3; 1)$.'
  },
  {
    id: 9,
    type: 'multiple-choice',
    topic: 'Tập hợp',
    content: 'Phần gạch sọc trong hình vẽ dưới đây biểu diễn tập hợp nào?',
    image: 'venn-diagram',
    options: [
      '$A \\cap B$',
      '$A \\cup B$',
      '$A \\backslash B$',
      '$B \\backslash A$'
    ],
    correctAnswer: '$A \\backslash B$',
    explanation: 'Phần gạch sọc nằm trong $A$ nhưng không nằm trong $B$, đó chính là hiệu của $A$ và $B$.'
  }
];
