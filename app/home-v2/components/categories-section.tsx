export default function CategoriesSection() {
  const categories = [
    { emoji: '\uD83C\uDF3E', name: 'Agriculture, Food & Nutrition' },
    { emoji: '\uD83D\uDCE2', name: 'Branding, Marketing & Sales' },
    { emoji: '\uD83D\uDCBB', name: 'Computing, Data & Digital Technology' },
    { emoji: '\uD83C\uDF93', name: 'Education, Skilling & Career' },
    { emoji: '\uD83D\uDCB0', name: 'Finance, Banking & Insurance' },
    { emoji: '\uD83C\uDFDB\uFE0F', name: 'Government, Public Sector & Welfare' },
    { emoji: '\uD83D\uDC8A', name: 'Health, Wellness & Personal Care' },
    { emoji: '\uD83D\uDC65', name: 'HR, Employment & GigWork' },
    { emoji: '\uD83D\uDD27', name: 'Installation, Repair & Tech Support' },
    { emoji: '\u2696\uFE0F', name: 'Legal, Police & Protection' },
    { emoji: '\uD83C\uDFED', name: 'Manufacturing, Procurement & Production' },
    { emoji: '\u2764\uFE0F', name: 'Matchmaking, Relationships & Guidance' },
    { emoji: '\uD83C\uDFAC', name: 'Media, Entertainment & Sports' },
    { emoji: '\uD83C\uDFE0', name: 'Real Estate, Infra & Construction' },
    { emoji: '\uD83D\uDE9A', name: 'Transport, Logistics & Storage' },
    { emoji: '\u2708\uFE0F', name: 'Travel, Tourism & Hospitality' },
  ];

  return (
    <section className="py-20 bg-saubh-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 anim-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
            <i className="fas fa-compass text-saubh-green" />
            <span className="text-saubh-green">Explore Opportunities</span>
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-5 text-saubh-text">
            Explore Opportunities and Offerings<br />across <span className="grad-text">16 sectors</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 anim-up">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3.5 px-4 py-5 rounded-2xl bg-saubh-card border border-saubh-border text-sm font-medium text-saubh-text hover:border-white/20 hover:-translate-y-0.5 transition-all cursor-pointer">
              <span className="text-2xl flex-shrink-0">{cat.emoji}</span> {cat.name}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 anim-up">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-green text-saubh-green font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-user-plus" /> Offer Service/Product</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-orange text-saubh-orange font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-plus-circle" /> Post Requirements</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-white/25 text-saubh-text font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-calendar-check" /> Schedule a Demo</a>
        </div>
      </div>
    </section>
  );
}
