import pydot
def parseDot(dotFilepath,svgFilepath):
	graph = pydot.graph_from_dot_file(filepath)
	graph.write_png('somefile.png')
	
