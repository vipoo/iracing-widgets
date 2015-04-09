import 'when/monitor/console';

process.on('unhandledRejection', function(reason, p){
  $logger.error(reason)
  var x = p.context
  if( x ) {
    $logger.error(cleanStack(x.stack))
    while( x.parent ) {
      x = x.parent
      $logger.error(cleanStack(x.stack))
    }
  }
})

function cleanStack(stack) {
  var stackLines = stack.split('\n')
  var newStack = stackLines
    .filter(s => !s.match(/node_modules\/when/))
    .filter(s => !s.match(/process\._tickCallback/))
    .filter(s => !s.match(/\[object Object\]/))
  if( newStack.length === 0 )
    return '---'
  return newStack.join('\n')
}
