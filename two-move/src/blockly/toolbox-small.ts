
export const toolbox = {
    'kind': 'flyoutToolbox',
    'contents': [
        {
            'kind': 'block',
            'type': 'move',
            
        },
        {
            'kind': 'block',
            'type': 'turn-right',
            
        },
          {
            'kind': 'block',
            'type': 'controls_repeat_ext',
            'inputs': {
              'TIMES': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 2,
                  },
                },
              },
            },
          },
          
    ],
  };