import type { FactorTreeNode } from '@/lib/math/number';

type FactorTreeProps = {
  tree: FactorTreeNode;
};

function TreeNode({ node }: { node: FactorTreeNode }) {
  const isPrime = node.children === null;
  return (
    <div className="flex flex-col items-center">
      <span
        className={`flex h-11 min-w-[2.75rem] items-center justify-center rounded-full px-3 font-mono text-lg font-bold tabular-nums shadow-sm ${
          isPrime ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-900'
        }`}
      >
        {node.value}
      </span>
      {node.children && (
        <div className="flex items-start gap-10 border-t-2 border-slate-300 pt-4">
          {node.children.map((child, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <span className="absolute -top-4 h-4 w-0.5 bg-slate-300" aria-hidden="true" />
              <TreeNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FactorTree({ tree }: FactorTreeProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto flex w-max min-w-full justify-center py-2">
        <TreeNode node={tree} />
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        Os círculos azuis são os fatores primos.
      </p>
    </div>
  );
}
