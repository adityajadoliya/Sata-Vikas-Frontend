import FormHeader from './FormHeader';
import ProductionGrid from './ProductionGrid';
import TPMLossGrid from './TPMLossGrid';
import FormPageAFooter from './FormPageAFooter';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

export default function FormViewer({ data, editable = false, onChange }) {
  const scrollRef = useHorizontalScroll();

  return (
    <div ref={scrollRef} className={`form-grid w-full overflow-x-auto no-scrollbar ${editable ? 'form-editing' : ''}`}>
      <table className="w-full min-w-[1150px] border-collapse border-2 border-slate-500 bg-white dark:bg-slate-900">
        <colgroup>
          <col style={{ width: '32px' }} />
          <col style={{ width: '252px' }} />
          <col style={{ width: '36px' }} />
          <col style={{ width: '55px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '65px' }} />
        </colgroup>
        <tbody>
          {/* Header Section */}
          <FormHeader data={data} editable={editable} onChange={onChange} />

          {/* Production Grid */}
          <ProductionGrid data={data} editable={editable} onChange={onChange} />

          {/* TPM 16 Loss Grid */}
          <TPMLossGrid data={data} editable={editable} onChange={onChange} />

          {/* Page A Footer Section */}
          <FormPageAFooter data={data} editable={editable} onChange={onChange} />
        </tbody>
      </table>
    </div>
  );
}
