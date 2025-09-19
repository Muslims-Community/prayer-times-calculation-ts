# 🤝 Contributing Guide - اردو

Prayer Times Calculation SDK میں آپ کی دلچسپی کا شکریہ! ہم community کی contributions کو خوش آمدید کہتے ہیں۔

## 📋 فہرست

- [شرکت کے طریقے](#شرکت-کے-طریقے)
- [Development Setup](#development-setup)
- [کوڈ کے معیار](#کوڈ-کے-معیار)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## 🌟 شرکت کے طریقے

آپ مختلف طریقوں سے اس project میں حصہ لے سکتے ہیں:

### 🐛 Bug Reports

- Bug reports submit کریں
- مسائل کو reproduce کریں
- Fixes کی تجاویز دیں

### ✨ Feature Requests

- نئے features کی تجویز دیں
- Use cases کی وضاحت کریں
- Implementation ideas شیئر کریں

### 💻 Code Contributions

- Bug fixes implement کریں
- نئے features develop کریں
- Performance improvements کریں
- Documentation بہتر بنائیں

### 📚 Documentation

- Documentation کو improve کریں
- نئی examples لکھیں
- Translations میں مدد کریں

### 🧪 Testing

- Manual testing کریں
- Test cases لکھیں
- Edge cases کی شناخت کریں

## 🛠️ Development Setup

### Prerequisites

یہ tools آپ کے system میں installed ہونے چاہیے:

- **Node.js** (version 14 یا اس سے زیادہ)
- **npm** یا **yarn**
- **Git**

### Setup Steps

```bash
# Repository کو clone کریں
git clone https://github.com/your-username/prayer-times-calculation.git
cd prayer-times-calculation

# Dependencies install کریں
npm install

# Development build کریں
npm run build

# Tests run کریں
npm test
```

### Development Commands

```bash
# Development mode میں watch
npm run dev

# Build کریں
npm run build

# Tests run کریں
npm test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
```

## 📏 کوڈ کے معیار

### Code Style

ہم strict code standards follow کرتے ہیں:

- **TypeScript** - تمام کوڈ TypeScript میں لکھیں
- **ESLint** - لinting rules کو follow کریں
- **Prettier** - کوڈ formatting کے لیے
- **Jest** - testing framework

### Naming Conventions

```typescript
// Classes - PascalCase
class PrayerTimesSDK {}

// Functions اور variables - camelCase
function calculateFajrTime() {}
const prayerTimes = {};

// Constants - UPPER_SNAKE_CASE
const CALCULATION_METHODS = {};

// Interfaces - PascalCase with 'I' prefix (optional)
interface CalculationOptions {}
```

### جائز کوڈ کی مثال

```typescript
/**
 * فجر کا وقت calculate کرتا ہے
 * @param solarDeclination سورج کا declination
 * @param fajrAngle فجر کا زاویہ
 * @returns فجر کا وقت (minutes میں)
 */
function calculateFajrTime(
  solarDeclination: number,
  fajrAngle: number
): number {
  if (typeof solarDeclination !== 'number' || isNaN(solarDeclination)) {
    throw new Error('Invalid solar declination');
  }

  if (typeof fajrAngle !== 'number' || isNaN(fajrAngle)) {
    throw new Error('Invalid Fajr angle');
  }

  // Calculation logic...
  return 0;
}
```

## 🧪 Testing

### Test Categories

1. **Unit Tests** - Individual functions کے لیے
2. **Integration Tests** - SDK کے complete workflows کے لیے
3. **Performance Tests** - Speed اور memory usage کے لیے

### Test لکھنے کے rules

```typescript
describe('PrayerTimesSDK', () => {
  describe('getTimes', () => {
    it('کراچی کے لیے صحیح نماز کے اوقات return کرے', () => {
      // Arrange
      const sdk = new PrayerTimesSDK(
        24.8607, 67.0011, new Date('2025-01-19'), 5,
        { method: 'Karachi' }
      );

      // Act
      const times = sdk.getTimes();

      // Assert
      expect(times.fajr).toMatch(/^\d{2}:\d{2}$/);
      expect(times.dhuhr).toMatch(/^\d{2}:\d{2}$/);
      // مزید assertions...
    });

    it('invalid coordinates کے ساتھ error throw کرے', () => {
      expect(() => {
        new PrayerTimesSDK(95, 67, new Date(), 5, { method: 'Karachi' });
      }).toThrow('Invalid latitude');
    });
  });
});
```

### Test Coverage

- ہم **100%** test coverage maintain کرتے ہیں
- ہر نیا feature test کے ساتھ آنا چاہیے
- Edge cases کو cover کریں

## 🔄 Pull Request Process

### PR کا process

1. **Fork** repository کو اپنے account میں
2. **Feature branch** بنائیں: `git checkout -b feature/amazing-feature`
3. **Commits** کو clear messages کے ساتھ کریں
4. **Tests** لکھیں اور pass کرائیں
5. **Documentation** update کریں
6. **Pull Request** submit کریں

### PR Template

```markdown
## تبدیلیوں کا خلاصہ
<!-- آپ نے کیا تبدیلیاں کی ہیں -->

## قسم کی تبدیلی
- [ ] Bug fix (non-breaking change)
- [ ] نیا feature (non-breaking change)
- [ ] Breaking change (existing functionality کو متاثر کرتا ہے)
- [ ] Documentation update

## Testing
- [ ] Tests pass ہو رہے ہیں
- [ ] نئے tests شامل کیے گئے ہیں
- [ ] Manual testing کی گئی ہے

## Screenshots (اگر applicable ہو)

## یہ کیسے test کریں؟
1. Repository clone کریں
2. یہ branch checkout کریں: `git checkout feature/amazing-feature`
3. Dependencies install کریں: `npm install`
4. Tests run کریں: `npm test`
```

### Commit Messages

Clear اور descriptive commit messages لکھیں:

```bash
# اچھے commit messages
git commit -m "feat: قبلہ direction calculation شامل کی"
git commit -m "fix: hanafi asr calculation میں bug ٹھیک کیا"
git commit -m "docs: urdu examples کو update کیا"

# برے commit messages
git commit -m "changes"
git commit -m "fix"
git commit -m "update"
```

## 🐛 Issue Reporting

### Bug Report Template

جب آپ bug report کریں تو یہ معلومات شامل کریں:

```markdown
**Bug کی وضاحت**
واضح اور مختصر وضاحت کہ کیا مسئلہ ہے۔

**Reproduce کرنے کے steps**
1. یہ کریں '...'
2. اس پر click کریں '....'
3. یہاں scroll کریں '....'
4. یہ error دکھتا ہے

**متوقع behavior**
آپ کیا expect کر رہے تھے؟

**Screenshots**
اگر applicable ہو تو screenshots شامل کریں۔

**Environment:**
 - OS: [جیسے iOS]
 - Browser [جیسے chrome, safari]
 - Version [جیسے 22]

**اضافی context**
کوئی اور معلومات جو helpful ہو سکیں۔
```

### Feature Request Template

```markdown
**Feature کا خلاصہ**
واضح اور مختصر وضاحت کہ آپ کیا چاہتے ہیں۔

**مسئلہ کیا ہے؟**
یہ feature کس مسئلے کو حل کرے گا؟

**آپ کا proposed solution**
آپ کے خیال میں یہ کیسے implement ہونا چاہیے؟

**متبادل solutions**
کیا آپ نے کوئی اور solutions سوچے ہیں؟

**اضافی context**
کوئی اور معلومات، screenshots وغیرہ۔
```

## 🤝 Community Guidelines

### Respectful Communication

- **احترام** - تمام contributors کا احترام کریں
- **صبر** - نئے contributors کے ساتھ صبر سے کام لیں
- **مددگار** بنیں - سوالات کا جواب دینے میں مدد کریں

### اسلامی اقدار

یہ ایک اسلامی project ہے، لہذا:

- اسلامی اقدار کا احترام کریں
- مہذب زبان استعمال کریں
- دوسروں کی مدد کرنے کو ثواب سمجھیں

### Inclusive Environment

- ہر background کے لوگوں کو خوش آمدید
- متعدد زبانوں میں contributions welcome ہیں
- نئے contributors کی رہنمائی کریں

## 🎯 Priority Areas

ہمیں خاص طور پر ان علاقوں میں مدد چاہیے:

### 🌐 Internationalization

- **نئی زبانوں میں translation**
  - فارسی (Persian/Farsi)
  - انڈونیشیائی (Indonesian)
  - ترکی (Turkish)
  - ملیالم (Malayalam)
  - بنگالی (Bengali)

- **RTL languages کے لیے UI improvements**
- **Local calculation methods** کا اضافہ

### 🧮 Calculation Improvements

- **نئے calculation methods**
- **Regional customizations**
- **Accuracy improvements**
- **Performance optimizations**

### 📱 Platform Support

- **React Native** کے لیے optimization
- **Flutter/Dart** wrapper
- **Python** bindings
- **Mobile apps** کے لیے examples

### 📚 Documentation

- **Video tutorials**
- **Interactive examples**
- **Best practices guide**
- **Performance guide**

## 🏆 Recognition

Contributors کو مختلف طریقوں سے تسلیم کیا جاتا ہے:

### Contributors Wall

- README میں contributors کی فہرست
- GitHub contributors page
- Release notes میں شکریہ

### Badges

- **First Contribution** badge
- **Documentation Hero** badge
- **Bug Hunter** badge
- **Feature Creator** badge

## 📞 رابطہ

اگر آپ کے کوئی سوالات ہیں:

- **GitHub Discussions** - عام سوالات کے لیے
- **GitHub Issues** - bugs اور features کے لیے
- **Email** - team@prayer-times-sdk.org

## 📖 مزید وسائل

- [Code of Conduct](./CODE_OF_CONDUCT.ur.md)
- [API Documentation](./docs/ur/API.md)
- [Examples](./examples/ur/)
- [GitHub Issues](https://github.com/your-username/prayer-times-calculation/issues)

---

## 🙏 شکریہ

آپ کی contributions اس project کو بہتر بناتی ہیں۔ آپ کا وقت اور محنت قابل قدر ہے۔

**"خیر الناس أنفعهم للناس"**
*بہترین انسان وہ ہے جو دوسروں کے لیے زیادہ مفید ہو*

---

<div align="center">

Made with ❤️ for the Muslim Ummah

[🏠 Home](./README.ur.md) | [📚 API](./docs/ur/API.md) | [💻 Examples](./examples/ur/)

</div>