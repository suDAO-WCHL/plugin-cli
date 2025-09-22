export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getBlob' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getLastUpdatedBy' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'greet' : IDL.Func(
        [IDL.Text],
        [IDL.Text, IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'updateBlob' : IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
